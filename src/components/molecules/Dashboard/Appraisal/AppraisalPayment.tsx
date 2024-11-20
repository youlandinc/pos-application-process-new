import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import {
  Box,
  Stack,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useAsyncFn } from 'react-use';
import { enqueueSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { createPaymentIframe } from '@/utils';
import { useBreakpoints } from '@/hooks';

import {
  StyledButton,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import { SpecificalPaymentInfo } from '@/views/Saas/SpecificalPayment/components';

import { IAddress } from '@/models/common/Address';
import { DashboardPaymentDetailsResponse, HttpError } from '@/types';
import { _getPaymentSignature } from '@/requests';

interface PaymentTableProps {
  paymentDetail: DashboardPaymentDetailsResponse | undefined;
  backStep: () => void;
  backState: boolean;
  nextState: boolean;
  nextStep: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  callback?: () => void;
}

const STEP_LABELS = ['Fill in billing information', 'Payment'];

const defaultAddress = {
  formatAddress: '',
  city: '',
  state: '',
  postcode: '',
  aptNumber: '',
  street: '',
};

export const AppraisalPayment: FC<PaymentTableProps> = ({
  paymentDetail,
  backStep,
  backState,
  callback,
}) => {
  // const [checkProcessing, setCheckProcessing] = useState(false);
  const breakpoint = useBreakpoints();

  const [activeStep, setActiveStep] = useState(0);
  const [addressInfo, setAddressInfo] = useState(defaultAddress);

  const billingForm = useRef<HTMLFormElement | null>(null);
  const paymentContentRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhoneNumber, setBillingPhoneNumber] = useState('');

  const nextDisabled = [
    billingFirstName,
    billingLastName,
    addressInfo.formatAddress,
    addressInfo.city,
    addressInfo.state,
    addressInfo.postcode,
    billingEmail,
    billingPhoneNumber,
  ].some((item) => item === '');

  const fresh = () => {
    timeoutRef.current = setInterval(() => {
      callback?.();
    }, 2000);
  };

  const [state, getPaymentSignature] = useAsyncFn(async () => {
    const flag = billingForm?.current?.reportValidity();
    if (!flag) {
      return;
    }
    await _getPaymentSignature({
      bizOrderNo: paymentDetail!.orderNo,
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
        try {
          createPaymentIframe(
            res.data,
            paymentContentRef.current as HTMLElement,
          );
          fresh();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
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
    paymentDetail?.orderNo,
    paymentContentRef,
  ]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    return () => {
      clearInterval(timeoutRef.current as NodeJS.Timeout);
    };
  }, []);

  return ['xl', 'xxl'].includes(breakpoint) ? (
    <Stack gap={{ xs: 6, lg: 8 }} width={'100%'}>
      <Stack flexDirection={'row'} gap={6} width={'100%'}>
        <Stack gap={3} maxWidth={900} minWidth={780}>
          <Typography fontSize={{ xs: 20, lg: 24 }}>
            Complete your appraisal payment below
          </Typography>

          <Stack borderRadius={2} width={'100%'}>
            <Stepper
              activeStep={activeStep}
              connector={
                <Box borderBottom={'1px dashed #ccc'} height={0} width={80} />
              }
              sx={{ mb: 3 }}
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
            {activeStep === 0 && (
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
                <Typography color={'text.primary'} variant={'subtitle1'}>
                  Billing information
                </Typography>

                <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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

                <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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
                    onValueChange={({ value }) => setBillingPhoneNumber(value)}
                    placeholder={'Phone number'}
                    required
                    value={billingPhoneNumber}
                  />
                </Stack>

                <Stack gap={3}>
                  <Typography color={'text.primary'} variant={'subtitle1'}>
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
            <Box
              height={activeStep === 1 ? 'fit-content' : 0}
              overflow={'hidden'}
              position={'relative'}
              ref={paymentContentRef}
            />
            <Typography mt={3} variant={'body3'}>
              <strong>Important:</strong> By proceeding, you acknowledge that
              the payment amount may be adjusted due to extenuating property
              factors such as size or location. Additionally, if your property
              does not meet the required standards during inspection, you will
              be responsible for the cost of a second appraisal. Please be aware
              that paying for and ordering an appraisal does not guarantee loan
              approval. We recommend waiting for loan approval before placing
              the order.
            </Typography>
          </Stack>

          <Stack
            flexDirection={'row'}
            gap={3}
            maxWidth={600}
            mt={{ xs: 3, lg: 5 }}
          >
            <StyledButton
              color={'info'}
              disabled={backState}
              loading={backState}
              onClick={backStep}
              sx={{
                flex: 1,
                maxWidth: 276,
              }}
              variant={'text'}
            >
              Back
            </StyledButton>

            {activeStep === 0 && (
              <StyledButton
                disabled={nextDisabled || state.loading}
                loading={state.loading}
                onClick={async () => {
                  await getPaymentSignature();
                }}
                sx={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  flexShrink: 0,
                  maxWidth: 276,
                }}
                variant={'contained'}
              >
                Next
              </StyledButton>
            )}
          </Stack>
        </Stack>

        <Stack ml={'auto'} width={500}>
          <SpecificalPaymentInfo {...paymentDetail} />

          <Stack gap={3} mt={3}>
            <Typography color={'text.secondary'} mt={6} variant={'subtitle1'}>
              What happens next
            </Typography>
            <Typography
              color={'text.secondary'}
              component={'div'}
              fontWeight={500}
              variant={'body3'}
            >
              Once you pay:
              <Typography
                color={'text.secondary'}
                component={'div'}
                variant={'body3'}
              >
                After you pay, we&apos;ll contact you to set a date for your
                property&apos;s appraisal.
              </Typography>
            </Typography>

            <Typography
              color={'text.secondary'}
              component={'div'}
              fontWeight={500}
              variant={'body3'}
            >
              Disclaimer:
              <Typography
                color={'text.secondary'}
                component={'div'}
                variant={'body3'}
              >
                Please not that paying for and ordering the appraisal does not
                guarantee funding of the loan. We advise that you wait until
                your loan is approved before placing the order.
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <Stack gap={{ xs: 6, lg: 8 }} width={'100%'}>
      <Typography fontSize={{ xs: 20, lg: 24 }}>
        Complete your appraisal payment below
      </Typography>

      <SpecificalPaymentInfo {...paymentDetail} />

      <Stack gap={3}>
        <Typography fontSize={{ xs: 20, lg: 24 }}>
          Complete your appraisal payment below
        </Typography>

        <Stack borderRadius={2} width={'100%'}>
          <Stepper
            activeStep={activeStep}
            connector={
              <Box borderBottom={'1px dashed #ccc'} height={0} width={80} />
            }
            sx={{ mb: 3 }}
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
          {activeStep === 0 && (
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
              <Typography color={'text.primary'} variant={'subtitle1'}>
                Billing information
              </Typography>

              <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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

              <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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
                  onValueChange={({ value }) => setBillingPhoneNumber(value)}
                  placeholder={'Phone number'}
                  required
                  value={billingPhoneNumber}
                />
              </Stack>

              <Stack gap={3}>
                <Typography color={'text.primary'} variant={'subtitle1'}>
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
          <Box
            height={activeStep === 1 ? 'fit-content' : 0}
            overflow={'hidden'}
            position={'relative'}
            ref={paymentContentRef}
          />
          <Typography mt={3} variant={'body3'}>
            <strong>Important:</strong> By proceeding, you acknowledge that the
            payment amount may be adjusted due to extenuating property factors
            such as size or location. Additionally, if your property does not
            meet the required standards during inspection, you will be
            responsible for the cost of a second appraisal. Please be aware that
            paying for and ordering an appraisal does not guarantee loan
            approval. We recommend waiting for loan approval before placing the
            order.
          </Typography>
        </Stack>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={{ xs: 3, lg: 5 }}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{
              flex: 1,
              maxWidth: 276,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>

          {activeStep === 0 && (
            <StyledButton
              disabled={nextDisabled || state.loading}
              loading={state.loading}
              onClick={async () => {
                await getPaymentSignature();
              }}
              sx={{
                flex: 1,
                alignSelf: 'flex-start',
                flexShrink: 0,
                maxWidth: 276,
              }}
              variant={'contained'}
            >
              Next
            </StyledButton>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
