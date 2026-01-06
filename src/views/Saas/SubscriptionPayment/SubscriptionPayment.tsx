import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  Box,
  Icon,
  Stack,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync, useAsyncFn } from 'react-use';

import { AUTO_HIDE_DURATION } from '@/constants';

import { useBreakpoints } from '@/hooks';
import { IAddress } from '@/models/common/Address';
import { _createSpecifyPayment, _getPaymentSignature } from '@/requests';

import { AppraisalTaskPaymentStatus, HttpError } from '@/types';
import {
  createPaymentIframe,
  POSGetParamsFromUrl,
  POSNotUndefined,
} from '@/utils';

import {
  StyledButton,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import { SubscriptionAddition, SubscriptionSummary } from './index';

import PAYMENT_SUCCESS from '@/views/Saas/SpecificalPayment/components/payment_success.svg';
import PAYMENT_FAIL from '@/views/Saas/SpecificalPayment/components/payment_failed.svg';

const STEP_LABELS = ['Fill in billing information', 'Payment'];

const defaultAddress = {
  formatAddress: '',
  city: '',
  state: '',
  postcode: '',
  aptNumber: '',
  street: '',
};

export const SubscriptionPayment = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const billingForm = useRef<HTMLFormElement>(null);
  const paymentContentRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhoneNumber, setBillingPhoneNumber] = useState('');

  const [paymentStatus, setPaymentStatus] =
    useState<AppraisalTaskPaymentStatus>(AppraisalTaskPaymentStatus.undone);

  const [activeStep, setActiveStep] = React.useState(0);
  const [addressInfo, setAddressInfo] = useState(defaultAddress);
  const basicInfo = [
    billingFirstName,
    billingLastName,
    addressInfo.formatAddress,
    addressInfo.city,
    addressInfo.state,
    addressInfo.postcode,
    billingEmail,
    billingPhoneNumber,
  ];

  const nextDisabled = basicInfo.some((item) => item === '');

  const { loading } = useAsync(async () => {
    const { orderNo, source } = POSGetParamsFromUrl(location.href);
    if (!POSNotUndefined(orderNo) || !POSNotUndefined(source)) {
      return;
    }
    await fetchData();
  });

  const fetchData = async () => {
    const { orderNo, source } = POSGetParamsFromUrl(location.href);
    try {
      const {
        data: {
          paymentStatus,

          firstName,
          lastName,
          email,
          phoneNumber,
          instructions,
        },
      } = await _createSpecifyPayment(orderNo, source);

      setPaymentStatus(paymentStatus ?? AppraisalTaskPaymentStatus.undone);

      setFirstName(firstName ?? '');
      setLastName(lastName ?? '');
      setEmail(email ?? '');
      setPhoneNumber(phoneNumber ?? '');
      setInstructions(instructions ?? '');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const [state, getPaymentSignature] = useAsyncFn(async () => {
    const flag = billingForm?.current?.reportValidity();
    if (!flag) {
      return;
    }
    // console.log(flag);
    const { orderNo } = POSGetParamsFromUrl(location.href);
    await onClickToPay();
    await _getPaymentSignature({
      bizOrderNo: orderNo,
      billTo: {
        firstName: billingFirstName,
        lastName: billingLastName,
        address1: addressInfo.formatAddress,
        locality: addressInfo.city,
        administrativeArea: addressInfo.state,
        postalCode: addressInfo.postcode,
        county: '',
        country: 'US',
        district: '',
        email: billingEmail,
        phoneNumber: billingPhoneNumber,
      },
    })
      .then((res) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        createPaymentIframe(
          res.data,
          paymentContentRef.current as HTMLDivElement,
        );
        timeoutRef.current = setInterval(() => {
          freshStatus();
        }, 2000);
        return res;
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
  }, [
    addressInfo,
    billingFirstName,
    billingLastName,
    billingEmail,
    billingPhoneNumber,
    email,
    firstName,
    instructions,
    lastName,
    phoneNumber,
  ]);

  const onClickToPay = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e?.preventDefault();
      e?.stopPropagation();
    },
    [],
  );

  const freshStatus = useCallback(async () => {
    const { orderNo, source } = POSGetParamsFromUrl(location.href);
    try {
      const {
        data: { paymentStatus },
      } = await _createSpecifyPayment(orderNo, source);
      if (paymentStatus === AppraisalTaskPaymentStatus.complete) {
        setPaymentStatus(paymentStatus ?? AppraisalTaskPaymentStatus.undone);
        clearInterval(timeoutRef.current as NodeJS.Timeout);
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [enqueueSnackbar, setPaymentStatus]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return () => {
      clearInterval(timeoutRef.current);
    };
  }, []);

  const renderPaymentStatus = useMemo(() => {
    switch (paymentStatus) {
      case AppraisalTaskPaymentStatus.complete:
        return (
          <Stack alignItems={'center'} gap={1.5} m={'0 auto'} maxWidth={800}>
            <Icon
              component={PAYMENT_SUCCESS}
              sx={{
                width: 268,
                height: 240,
              }}
            />
            <Typography color={'#69C0A5'} fontSize={30} fontWeight={600}>
              Payment received
            </Typography>
            <Typography color={'text.secondary'} textAlign={'center'}>
              A receipt will arrive in your inbox shortly. For any questions,
              please email us at support@corepass.com.
            </Typography>
          </Stack>
        );
      case AppraisalTaskPaymentStatus.fail:
        return (
          <Stack alignItems={'center'} gap={1.5} m={'0 auto'} maxWidth={800}>
            <Icon
              component={PAYMENT_FAIL}
              sx={{
                width: 268,
                height: 240,
              }}
            />
            <Typography color={'#DE6449'} fontSize={30} fontWeight={600}>
              Payment failed
            </Typography>
            <Typography color={'text.secondary'} textAlign={'center'}>
              We couldn’t process your card. Check that the card number, expiry,
              and CVC are correct, make sure there are enough funds, then click
              Try again.
            </Typography>
            <Typography color={'text.secondary'}>
              Still stuck? Please email us at support@corepass.com.
            </Typography>

            <StyledButton
              onClick={() => {
                setPaymentStatus(AppraisalTaskPaymentStatus.undone);
                return router.reload();
              }}
              sx={{ width: 240, mt: 4.5 }}
            >
              Try again
            </StyledButton>
          </Stack>
        );
      case AppraisalTaskPaymentStatus.processing:
        return <StyledLoading sx={{ color: 'text.grey' }} />;
    }
  }, [paymentStatus, router]);

  return (
    <Stack
      bgcolor={'#FFFFFF'}
      margin={'0 auto'}
      pb={10}
      width={{
        xxl: 1440,
        xl: 1240,
        lg: 938,
        xs: '100%',
      }}
    >
      {loading ? (
        <Stack
          alignItems={'center'}
          height={'100vh'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      ) : (
        <Stack width={'100%'}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            height={92}
            mb={'clamp(24px,6.4vw,80px)'}
            px={{
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            }}
            width={'100%'}
          >
            <Stack flex={1} height={32} maxWidth={188} position={'relative'}>
              <Image
                alt={''}
                fill
                priority
                sizes={'100%'}
                src={'/images/logo/corepass.svg'}
              />
            </Stack>
          </Stack>

          {paymentStatus !== AppraisalTaskPaymentStatus.undone ? (
            renderPaymentStatus
          ) : (
            <Stack
              flexDirection={{ xs: 'column', xl: 'row' }}
              gap={{ xs: 3, md: 6 }}
              px={{
                lg: 0,
                xs: 'clamp(24px,6.4vw,80px)',
              }}
              width={'100%'}
            >
              <Stack gap={3} minWidth={{ xl: 500, xs: 'auto' }} width={'100%'}>
                <Stepper
                  activeStep={activeStep}
                  connector={
                    <Box
                      borderBottom={'1px dashed #ccc'}
                      height={0}
                      width={80}
                    />
                  }
                >
                  {STEP_LABELS.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepButton
                          onClick={() => {
                            setActiveStep(index);
                            if (index === 0) {
                              clearInterval(
                                timeoutRef.current as NodeJS.Timeout,
                              );
                            }
                          }}
                        >
                          <StepLabel>{label}</StepLabel>
                        </StepButton>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep === 0 ? (
                  <>
                    <Stack
                      border={'1px solid #E4E7EF'}
                      borderRadius={2}
                      component={'form'}
                      flex={1}
                      gap={3}
                      minWidth={{ xl: 500, xs: 'auto' }}
                      p={3}
                      ref={billingForm}
                    >
                      <Typography color={'text.primary'} variant={'subtitle2'}>
                        Billing information
                      </Typography>

                      <Stack
                        flexDirection={{ xs: 'column', lg: 'row' }}
                        gap={3}
                      >
                        <StyledTextField
                          label={'First name'}
                          onChange={(e) => setBillingFirstName(e.target.value)}
                          placeholder={'First name'}
                          required
                          value={billingFirstName}
                        />
                        <StyledTextField
                          label={'Last name'}
                          onChange={(e) => setBillingLastName(e.target.value)}
                          placeholder={'Last name'}
                          required
                          value={billingLastName}
                        />
                      </Stack>

                      <Stack
                        flexDirection={{ xs: 'column', lg: 'row' }}
                        gap={3}
                      >
                        <StyledTextField
                          label={'Email'}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          placeholder={'Email'}
                          required
                          type={'email'}
                          value={billingEmail}
                        />
                        <StyledTextFieldPhone
                          label={'Phone number'}
                          onValueChange={({ value }) =>
                            setBillingPhoneNumber(value)
                          }
                          placeholder={'Phone number'}
                          required
                          value={billingPhoneNumber}
                        />
                      </Stack>
                      <Stack gap={3}>
                        <Typography
                          color={'text.primary'}
                          variant={'subtitle2'}
                        >
                          Current address
                        </Typography>
                        <StyledGoogleAutoComplete
                          address={
                            {
                              formatAddress: addressInfo.formatAddress,
                              state: addressInfo.state,
                              street: addressInfo.street,
                              aptNumber: addressInfo.aptNumber,
                              city: addressInfo.city,
                              postcode: addressInfo.postcode,
                              errors: {},
                              isValid: false,
                              changeFieldValue: (key: string, value: any) => {
                                setAddressInfo((prevState) => {
                                  return {
                                    ...prevState,
                                    [key]: value,
                                  };
                                });
                              },
                              reset: () => {
                                setAddressInfo(defaultAddress);
                              },
                            } as IAddress
                          }
                          label={'Address'}
                        />
                      </Stack>
                    </Stack>

                    {!['xl', 'xxl'].includes(breakpoints) && (
                      <Stack
                        flexShrink={0}
                        gap={{ xs: 3, md: 6 }}
                        width={{ xs: '100%', xl: 530 }}
                      >
                        <SubscriptionSummary
                          additional={
                            ['xl', 'xxl'].includes(breakpoints) ? (
                              <SubscriptionAddition sx={{ ml: 3 }} />
                            ) : null
                          }
                        />
                      </Stack>
                    )}
                    <Stack gap={3}>
                      <Typography variant={'body3'} width={'100%'}>
                        <strong>Important:</strong> This payment is for a
                        non-refundable one-time set up fee.
                      </Typography>
                      <StyledButton
                        disabled={nextDisabled || state.loading}
                        loading={state.loading}
                        onClick={async () => {
                          await getPaymentSignature();
                        }}
                        sx={{
                          width: 240,
                          flexShrink: 0,
                        }}
                        variant={'contained'}
                      >
                        Next
                      </StyledButton>
                    </Stack>
                  </>
                ) : null}
                <Box
                  height={activeStep === 1 ? 'auto' : 0}
                  overflow={'hidden'}
                  position={'relative'}
                  ref={paymentContentRef}
                />
              </Stack>

              {['xl', 'xxl'].includes(breakpoints) && (
                <Stack
                  flexShrink={0}
                  gap={{ xs: 3, md: 6 }}
                  width={{ xs: '100%', xl: 530 }}
                >
                  <SubscriptionSummary
                    additional={
                      ['xl', 'xxl'].includes(breakpoints) ? (
                        <SubscriptionAddition />
                      ) : null
                    }
                  />
                </Stack>
              )}

              {!['xl', 'xxl'].includes(breakpoints) && <SubscriptionAddition />}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
