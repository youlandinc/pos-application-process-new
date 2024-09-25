import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';
import {
  Box,
  Stack,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  //StyledPaymentCardRef,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import { SpecificalPaymentInfo } from '@/views/Saas/SpecificalPayment/components';

import { AUTO_HIDE_DURATION } from '@/constants';
import { IAddress } from '@/models/common/Address';
import { _getPaymentSignature } from '@/requests';
import { DashboardPaymentDetailsResponse, HttpError } from '@/types';

import { createPaymentIframe } from '@/utils';

interface PaymentTableProps {
  paymentDetail: DashboardPaymentDetailsResponse | undefined;
  backStep: () => void;
  backState: boolean;
  nextState: boolean;
  nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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

export const AppraisalPayment = forwardRef<
  //StyledPaymentCardRef,
  any,
  PaymentTableProps
>(({ paymentDetail, backStep, backState, callback }, ref) => {
  // const [checkProcessing, setCheckProcessing] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
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

  return (
    <StyledFormItem
      alignItems={'center'}
      gap={3}
      label={'Complete your appraisal payment below'}
      labelSx={{ textAlign: 'center' }}
      px={{ lg: 3, xs: 0 }}
    >
      <Stack mt={3} width={'100%'}>
        <SpecificalPaymentInfo {...paymentDetail} />
      </Stack>

      <Stack borderRadius={2} width={'100%'}>
        <Stepper
          activeStep={activeStep}
          connector={
            <Box borderBottom={'1px dashed #ccc'} height={0} width={80}></Box>
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
          </>
        ) : null}
        <Box
          height={activeStep === 1 ? 'auto' : 0}
          overflow={'hidden'}
          position={'relative'}
          // height={910}
          ref={paymentContentRef}
        ></Box>
      </Stack>

      <Typography mt={'-34px'} variant={'body3'}>
        <strong>Important:</strong> By proceeding, you acknowledge that the
        payment amount may be adjusted due to extenuating property factors such
        as size or location. Additionally, if your property does not meet the
        required standards during inspection, you will be responsible for the
        cost of a second appraisal. Please be aware that paying for and ordering
        an appraisal does not guarantee loan approval. We recommend waiting for
        loan approval before placing the order.
      </Typography>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
        maxWidth={600}
        mt={8}
        mx={'auto'}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          disabled={backState}
          loading={backState}
          onClick={backStep}
          sx={{ flex: 1 }}
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
              width: 240,
              alignSelf: 'flex-start',
              flexShrink: 0,
            }}
            variant={'contained'}
          >
            Next
          </StyledButton>
        )}
      </Stack>
    </StyledFormItem>
  );
});
