import React, { useCallback, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl, POSNotUndefined } from '@/utils';

import {
  StyledButton,
  StyledCheckbox,
  StyledLoading,
  StyledPaymentCard,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import {
  SpecificalAppraisalStatusProps,
  SpecificalPaymentAdditional,
  SpecificalPaymentAppraisalStatus,
  SpecificalPaymentInfo,
  SpecificalPaymentLogo,
  SpecificalPaymentStatus,
} from './components';

import { useBreakpoints } from '@/hooks';

import {
  AppraisalStatusEnum,
  AppraisalTaskPaymentStatus,
  HttpError,
} from '@/types';
import { _creatSpecifyPayment, _updateSpecifyContactInfo } from '@/requests';

const URL_HASH = {
  0: false,
  1: true,
};

export const SpecificalPaymentPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const paymentRef = useRef(null);
  const contactForm = useRef<HTMLFormElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const [clientSecret, setClientSecret] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [appraisalFees, setAppraisalFees] = useState(0);
  const [isExpedited, setIsExpedited] = useState(false);
  const [expeditedFees, setExpeditedFees] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentName, setPaymentName] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [checkProcessing, setCheckProcessing] = useState(false);

  const [loanId, setLoanId] = useState('');
  const [insideIsAdditional, setInsideIsAdditional] = useState(false);
  const [insideIsNeedToFill, setInsideIsNeedToFill] = useState(false);

  const [logo, setLogo] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhoneNumber, setContactPhoneNumber] = useState('');

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
          clientSecret,
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

      setClientSecret(clientSecret);
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
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

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
      setPayLoading(true);
      const paymentRes = await (paymentRef.current as unknown as any).onSubmit(
        e,
      );
      if (paymentRes) {
        const { status } = paymentRes;
        if (status === AppraisalTaskPaymentStatus.complete) {
          setPaymentStatus(status as string as AppraisalTaskPaymentStatus);
        }
      }

      setPayLoading(false);
    },
    [insideIsNeedToFill, onSubmitContactForm],
  );

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
              <Stack
                gap={{ xs: 3, md: 6 }}
                minWidth={{ xl: 500, xs: 'auto' }}
                width={'100%'}
              >
                {insideIsNeedToFill && (
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
                    <Typography
                      color={'text.primary'}
                      fontSize={{
                        xs: 18,
                        md: 24,
                      }}
                      variant={'h5'}
                    >
                      Property inspection contact information
                    </Typography>

                    <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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

                    <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
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
                )}

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
                  border={'1px solid #E4E7EF'}
                  borderRadius={2}
                  flex={1}
                  gap={{ xs: 1.5, md: 3 }}
                  p={3}
                >
                  <Typography
                    color={'text.primary'}
                    fontSize={{
                      xs: 18,
                      md: 24,
                    }}
                    variant={'h5'}
                  >
                    Complete your appraisal payment
                  </Typography>

                  <Typography
                    fontSize={{
                      xs: 12,
                      md: 14,
                    }}
                    variant={'body2'}
                  >
                    To move forward with your loan application, please complete
                    the payment below.
                  </Typography>

                  <StyledPaymentCard
                    hideFooter
                    mode={'uncheck'}
                    ref={paymentRef}
                    secret={clientSecret}
                  />

                  <StyledCheckbox
                    checked={checkProcessing}
                    label={
                      <>
                        <b>Important: </b> By proceeding, you acknowledge that
                        if your property doesn&apos;t meet the required
                        standards at the time of the inspection, you&apos;ll be
                        responsible for the cost of a second appraisal.
                        Furthermore, certain property types (rural, large
                        property size) or urgent requests may require additional
                        payments.
                      </>
                    }
                    onChange={(e) => {
                      setCheckProcessing(e.target.checked);
                    }}
                    sx={{
                      mr: 1,
                      mt: 1,
                      '& .MuiCheckbox-root': {
                        mt: '-9px',
                        mr: '-9px',
                      },
                    }}
                  />

                  <StyledButton
                    disabled={!checkProcessing || payLoading}
                    loading={payLoading}
                    onClick={onClickToPay}
                    sx={{ width: '100%' }}
                  >
                    Pay now
                  </StyledButton>
                </Stack>
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
