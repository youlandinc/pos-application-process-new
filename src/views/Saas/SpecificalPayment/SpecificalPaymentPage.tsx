import {
  StyledButton,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

import { AUTO_HIDE_DURATION } from '@/constants';

import { useBreakpoints } from '@/hooks';
import { IAddress } from '@/models/common/Address';
import {
  _creatSpecifyPayment,
  _getPaymentSignature,
  _updateSpecifyContactInfo,
} from '@/requests';

import {
  AppraisalStatusEnum,
  AppraisalTaskPaymentStatus,
  HttpError,
} from '@/types';
import {
  createPaymentIframe,
  POSGetParamsFromUrl,
  POSNotUndefined,
} from '@/utils';
import {
  Box,
  Stack,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import {
  SpecificalAppraisalStatusProps,
  SpecificalPaymentAdditional,
  SpecificalPaymentAppraisalStatus,
  SpecificalPaymentInfo,
  SpecificalPaymentLogo,
  SpecificalPaymentStatus,
} from './components';

const URL_HASH = {
  0: false,
  1: true,
};

const STEP_LABELS = ['Fill in billing information', 'Payment'];

const defaultAddress = {
  formatAddress: '',
  city: '',
  state: '',
  postcode: '',
  aptNumber: '',
  street: '',
};

export const SpecificalPaymentPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  // const paymentRef = useRef(null);
  const contactForm = useRef<HTMLFormElement>(null);
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

  // const [clientSecret, setClientSecret] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [appraisalFees, setAppraisalFees] = useState(0);
  const [isExpedited, setIsExpedited] = useState(false);
  const [expeditedFees, setExpeditedFees] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentName, setPaymentName] = useState('');
  // const [payLoading, setPayLoading] = useState(false);
  // const [checkProcessing, setCheckProcessing] = useState(false);
  // const [isSameInfo, setIsSameInfo] = useState(false);

  const [loanId, setLoanId] = useState('');
  const [insideIsAdditional, setInsideIsAdditional] = useState(false);
  const [insideIsNeedToFill, setInsideIsNeedToFill] = useState(false);

  const [logo, setLogo] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhoneNumber, setContactPhoneNumber] = useState('');
  // const [signatureData, setSignatureData] = useState<Record<string, any>>({});

  const [paymentStatus, setPaymentStatus] =
    useState<AppraisalTaskPaymentStatus>(AppraisalTaskPaymentStatus.undone);
  const [appraisalStatus, setAppraisalStatus] = useState<AppraisalStatusEnum>(
    AppraisalStatusEnum.canceled,
  );
  const [appraisalStatusDetail, setAppraisalStatusDetail] = useState<
    SpecificalAppraisalStatusProps['appraisalDetail']
  >({
    [AppraisalStatusEnum.paid_for]: null,
    [AppraisalStatusEnum.ordered]: null,
    [AppraisalStatusEnum.scheduled]: null,
    [AppraisalStatusEnum.canceled]: null,
    [AppraisalStatusEnum.completed]: null,
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [addressInfo, setAddressInfo] = useState(defaultAddress);

  const nextDisabled = [
    billingFirstName,
    billingLastName,
    addressInfo.formatAddress,
    addressInfo.city,
    addressInfo.state,
    addressInfo.postcode,
    billingEmail,
    billingPhoneNumber,
    firstName,
    lastName,
    phoneNumber,
  ].some((item) => item === '');

  const { loading } = useAsync(async () => {
    const { isNeedToFill, orderNo, source, isAdditional } = POSGetParamsFromUrl(
      location.href,
    );
    if (
      !POSNotUndefined(orderNo) ||
      !POSNotUndefined(source) ||
      !POSNotUndefined(isNeedToFill) ||
      !POSNotUndefined(isAdditional)
    ) {
      return;
    }
    setInsideIsNeedToFill(URL_HASH[isNeedToFill as unknown as 0 | 1]);
    setInsideIsAdditional(URL_HASH[isAdditional as unknown as 0 | 1]);
    await fetchData();
  });

  const fetchData = async () => {
    const { orderNo, source } = POSGetParamsFromUrl(location.href);
    try {
      const {
        data: {
          loanId,
          // clientSecret,
          paymentAmount,
          propertyAddress,
          productName,
          expeditedFees,
          appraisalFees,
          isExpedited,
          paymentName,

          paymentStatus,
          appraisalStatus,
          appraisalStatusDetail,

          firstName,
          lastName,
          email,
          phoneNumber,
          instructions,

          logo,
          organizationName,
          contactEmail,
          contactPhoneNumber,
        },
      } = await _creatSpecifyPayment(orderNo, source);

      setLogo(logo ?? '');
      setOrganizationName(organizationName ?? '');
      setContactEmail(contactEmail ?? '');
      setContactPhoneNumber(contactPhoneNumber ?? '');

      // setClientSecret(clientSecret);
      setProductName(productName);
      setPropertyAddress(propertyAddress);
      setAppraisalFees(appraisalFees);
      setIsExpedited(isExpedited);
      setExpeditedFees(expeditedFees);
      setPaymentAmount(paymentAmount);

      setPaymentName(paymentName ?? '');

      setPaymentStatus(paymentStatus ?? AppraisalTaskPaymentStatus.undone);
      setAppraisalStatus(appraisalStatus ?? AppraisalStatusEnum.canceled);
      setAppraisalStatusDetail(appraisalStatusDetail);

      setFirstName(firstName ?? '');
      setLastName(lastName ?? '');
      setEmail(email ?? '');
      setPhoneNumber(phoneNumber ?? '');
      setInstructions(instructions ?? '');

      setLoanId(loanId ?? '');
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
        firstName: 'mike',
        lastName: 'joyy',
        address1: '850 Collins Avenue 306',
        locality: 'Miami Beach',
        administrativeArea: 'FL',
        postalCode: '33139',
        county: '',
        country: 'US',
        district: '',
        email: 'mike2yeqiu@outlook.com',
        phoneNumber: '18458214366',
        /* firstName: billingFirstName,
          lastName: billingLastName,
          address1: addressInfo.formatAddress,
          locality: addressInfo.city,
          administrativeArea: addressInfo.state,
          postalCode: addressInfo.postcode,
          county: '',
          country: 'US',
          district: '',
          email: billingEmail,
          phoneNumber: billingPhoneNumber,*/
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
  ]);

  const onButtonClick = async () => {
    if (paymentStatus === AppraisalTaskPaymentStatus.fail) {
      setPaymentStatus(AppraisalTaskPaymentStatus.undone);
      return;
    }
    return router.reload();
  };

  const onSubmitContactForm = useCallback(async () => {
    const params = {
      loanId,
      firstName,
      lastName,
      email,
      phoneNumber,
      instructions,
    };
    try {
      await _updateSpecifyContactInfo(params);
      return 'success';
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      return 'error';
    }
  }, [
    email,
    enqueueSnackbar,
    firstName,
    instructions,
    lastName,
    loanId,
    phoneNumber,
  ]);

  const onClickToPay = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (insideIsNeedToFill) {
        const flag = contactForm?.current?.reportValidity();
        if (!flag) {
          return;
        }
        const res = await onSubmitContactForm();
        if (res === 'error') {
          return;
        }
      }
      // setPayLoading(true);
      // const paymentRes = await (paymentRef.current as unknown as any).onSubmit(
      //   e,
      // );
      // if (paymentRes) {
      //   const { status } = paymentRes;
      //   if (status === AppraisalTaskPaymentStatus.complete) {
      //     setPaymentStatus(status as string as AppraisalTaskPaymentStatus);
      //   }
      // }

      // setPayLoading(false);
    },
    [insideIsNeedToFill, onSubmitContactForm],
  );

  const freshStatus = useCallback(async () => {
    const { orderNo, source } = POSGetParamsFromUrl(location.href);
    try {
      const {
        data: { paymentStatus, appraisalStatus, appraisalStatusDetail },
      } = await _creatSpecifyPayment(orderNo, source);
      if (paymentStatus === AppraisalTaskPaymentStatus.complete) {
        setPaymentStatus(paymentStatus ?? AppraisalTaskPaymentStatus.undone);
        setAppraisalStatus(appraisalStatus ?? AppraisalStatusEnum.canceled);
        setAppraisalStatusDetail(appraisalStatusDetail);
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
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return () => {
      clearInterval(timeoutRef.current);
    };
  }, []);

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
            <SpecificalPaymentLogo
              logoUrl={logo}
              organizationName={organizationName}
            />
          </Stack>

          {paymentStatus !== AppraisalTaskPaymentStatus.undone ? (
            appraisalStatus === AppraisalStatusEnum.not_started ? (
              <SpecificalPaymentStatus
                contactEmail={contactEmail}
                contactPhoneNumber={contactPhoneNumber}
                onButtonClick={onButtonClick}
                paymentStatus={paymentStatus}
              />
            ) : (
              <SpecificalPaymentAppraisalStatus
                appraisalDetail={appraisalStatusDetail}
                appraisalStatus={appraisalStatus}
                email={email}
                firstName={firstName}
                instructions={instructions}
                lastName={lastName}
                phoneNumber={phoneNumber}
              />
            )
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
                    ></Box>
                  }
                >
                  {STEP_LABELS.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepButton
                          onClick={() => {
                            setActiveStep(index);
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
                    {insideIsNeedToFill && (
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
                        <Typography
                          color={'text.primary'}
                          variant={'subtitle2'}
                        >
                          Billing information
                        </Typography>

                        <Stack
                          flexDirection={{ xs: 'column', lg: 'row' }}
                          gap={3}
                        >
                          <StyledTextField
                            label={'First name'}
                            onChange={(e) =>
                              setBillingFirstName(e.target.value)
                            }
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
                    )}
                    <Stack
                      border={'1px solid #E4E7EF'}
                      borderRadius={2}
                      component={'form'}
                      flex={1}
                      gap={3}
                      minWidth={{ xl: 500, xs: 'auto' }}
                      p={3}
                      ref={contactForm}
                    >
                      <Typography color={'text.primary'} variant={'subtitle2'}>
                        Property inspection contact information
                      </Typography>
                      {/*    <StyledCheckbox
                    checked={isSameInfo}
                    label={
                      'The property inspection contact information is the same as above'
                    }
                    onChange={(e) => {
                      setIsSameInfo(e.target.checked);
                    }}
                  />*/}
                      <Stack
                        flexDirection={{ xs: 'column', lg: 'row' }}
                        gap={3}
                      >
                        <StyledTextField
                          label={'First name'}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={'First name'}
                          required
                          value={firstName}
                        />
                        <StyledTextField
                          label={'Last name'}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder={'Last name'}
                          required
                          value={lastName}
                        />
                      </Stack>

                      <Stack
                        flexDirection={{ xs: 'column', lg: 'row' }}
                        gap={3}
                      >
                        <StyledTextField
                          label={'Email (optional)'}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={'Email (optional)'}
                          value={email}
                        />
                        <StyledTextFieldPhone
                          label={'Phone number'}
                          onValueChange={({ value }) => setPhoneNumber(value)}
                          placeholder={'Phone number'}
                          required
                          value={phoneNumber}
                        />
                      </Stack>

                      <StyledTextField
                        label={'Property access instructions (optional)'}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder={'Property access instructions (optional)'}
                        value={instructions}
                      />
                    </Stack>

                    {!['xl', 'xxl'].includes(breakpoints) && (
                      <Stack
                        flexShrink={0}
                        gap={{ xs: 3, md: 6 }}
                        width={{ xs: '100%', xl: 530 }}
                      >
                        <SpecificalPaymentInfo
                          additional={
                            ['xl', 'xxl'].includes(breakpoints) ? (
                              <SpecificalPaymentAdditional sx={{ ml: 3 }} />
                            ) : null
                          }
                          appraisalFees={appraisalFees}
                          expeditedFees={expeditedFees}
                          isAdditional={insideIsAdditional}
                          isExpedited={isExpedited}
                          paymentAmount={paymentAmount}
                          paymentName={paymentName}
                          productName={productName}
                          propertyAddress={propertyAddress}
                        />
                      </Stack>
                    )}
                    <Stack
                      alignItems={{
                        xs: 'center',
                        lg: 'flex-start',
                      }}
                      direction={{
                        xs: 'column',
                        lg: 'row',
                      }}
                      gap={3}
                    >
                      <Typography variant={'body3'}>
                        <strong>Important:</strong> By proceeding, you
                        acknowledge that the payment amount may be adjusted due
                        to extenuating property factors such as size or
                        location. Additionally, if your property does not meet
                        the required standards during inspection, you will be
                        responsible for the cost of a second appraisal. Please
                        be aware that paying for and ordering an appraisal does
                        not guarantee loan approval. We recommend waiting for
                        loan approval before placing the order.
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
                ></Box>
              </Stack>

              {['xl', 'xxl'].includes(breakpoints) && (
                <Stack
                  flexShrink={0}
                  gap={{ xs: 3, md: 6 }}
                  width={{ xs: '100%', xl: 530 }}
                >
                  <SpecificalPaymentInfo
                    additional={
                      ['xl', 'xxl'].includes(breakpoints) ? (
                        <SpecificalPaymentAdditional />
                      ) : null
                    }
                    appraisalFees={appraisalFees}
                    expeditedFees={expeditedFees}
                    isAdditional={insideIsAdditional}
                    isExpedited={isExpedited}
                    paymentAmount={paymentAmount}
                    paymentName={paymentName}
                    productName={productName}
                    propertyAddress={propertyAddress}
                  />
                </Stack>
              )}

              {!['xl', 'xxl'].includes(breakpoints) && (
                <SpecificalPaymentAdditional />
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
