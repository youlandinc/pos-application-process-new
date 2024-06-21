import { useCallback, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
// import { addDays, format } from 'date-fns';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl, POSNotUndefined } from '@/utils';

import {
  AppraisalStatusEnum,
  AppraisalTaskPaymentStatus,
  HttpError,
} from '@/types';

import {
  StyledHeaderLogo,
  StyledLoading,
  StyledPaymentCard,
  StyledTextField,
} from '@/components/atoms';

const URL_HASH = {
  0: false,
  1: true,
};

const APPRAISAL_HASH = {
  [AppraisalStatusEnum.paid_for]: 0,
  [AppraisalStatusEnum.ordered]: 1,
  [AppraisalStatusEnum.scheduled]: 2,
  [AppraisalStatusEnum.completed]: 3,
  [AppraisalStatusEnum.canceled]: 0,
  [AppraisalStatusEnum.not_started]: 0,
};

import {
  SpecificalPaymentAdditional,
  SpecificalPaymentInfo,
  SpecificalPaymentStatus,
} from './components';

import { useBreakpoints } from '@/hooks';

import { _creatSpecifyPayment } from '@/requests';
import { AppraisalStatusProps } from '@/components/molecules';

export const SpecificalPaymentPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [clientSecret, setClientSecret] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [appraisalFees, setAppraisalFees] = useState(0);
  const [isExpedited, setIsExpedited] = useState(false);
  const [expeditedFees, setExpeditedFees] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentName, setPaymentName] = useState('');

  const [loanId, setLoanId] = useState('');
  const [insideIsAdditional, setInsideIsAdditional] = useState(false);
  const [insideIsNeedToFill, setInsideIsNeedToFill] = useState(false);

  const [paymentStatus, setPaymentStatus] =
    useState<AppraisalTaskPaymentStatus>(AppraisalTaskPaymentStatus.undone);

  const [appraisalStage, setAppraisalStage] = useState<AppraisalStatusEnum>(
    AppraisalStatusEnum.canceled,
  );
  const [appraisalStatusDetail, setAppraisalStatusDetail] =
    useState<AppraisalStatusProps['appraisalDetail']>();

  const onButtonClick = useCallback(() => {
    // if (paymentStatus === 'requires_payment_method') {
    //   return setPaymentStatus('');
    // }
    return (window.location.href = 'https://www.youland.com');
  }, [paymentStatus]);

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

    try {
      const {
        data: {
          loanId,
          clientSecret,
          paymentAmount,
          // borrowerName,
          propertyAddress,
          productName,
          expeditedFees,
          appraisalFees,
          isExpedited,
          paymentName,
          paymentStatus,
          appraisalStatusDetail,
        },
      } = await _creatSpecifyPayment(orderNo, source);
      setClientSecret(clientSecret);
      setProductName(productName);
      setPropertyAddress(propertyAddress);
      //
      setAppraisalFees(appraisalFees);
      setIsExpedited(isExpedited);
      setExpeditedFees(expeditedFees);
      setPaymentAmount(paymentAmount);
      //
      setPaymentName(paymentName ?? '');

      setPaymentStatus(paymentStatus);

      setAppraisalStatusDetail(appraisalStatusDetail);

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
  });

  console.log(insideIsNeedToFill, insideIsAdditional);

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
            <StyledHeaderLogo />
          </Stack>

          {paymentStatus ? (
            <SpecificalPaymentStatus
              onButtonClick={onButtonClick}
              paymentStatus={paymentStatus}
            />
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
                <Stack
                  border={'1px solid #E4E7EF'}
                  borderRadius={2}
                  flex={1}
                  gap={3}
                  minWidth={{ xl: 500, xs: 'auto' }}
                  order={{ xs: 2, xl: 1 }}
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
                    Property inspection contact information
                  </Typography>

                  <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                    <StyledTextField
                      label={'First name'}
                      placeholder={'First name'}
                    />
                    <StyledTextField
                      label={'Last name'}
                      placeholder={'Last name'}
                    />
                  </Stack>

                  <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                    <StyledTextField label={'Email'} placeholder={'Email'} />
                    <StyledTextField
                      label={'Phone number'}
                      placeholder={'Phone number'}
                    />
                  </Stack>

                  <StyledTextField
                    label={'Property access instructions'}
                    placeholder={'Property access instructions'}
                  />
                </Stack>

                <Stack
                  border={'1px solid #E4E7EF'}
                  borderRadius={2}
                  flex={1}
                  gap={{ xs: 1.5, md: 3 }}
                  order={{ xs: 2, xl: 1 }}
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
                    // cb={(status) => {
                    //   setPaymentStatus(status);
                    // }}
                    mode={'uncheck'}
                    secret={clientSecret}
                  />
                </Stack>
              </Stack>

              <Stack
                flexShrink={0}
                gap={{ xs: 3, md: 6 }}
                order={{ xs: 1, xl: 2 }}
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
                  isExpedited={isExpedited}
                  paymentAmount={paymentAmount}
                  paymentName={paymentName}
                  productName={productName}
                  propertyAddress={propertyAddress}
                />
              </Stack>

              {!['xl', 'xxl'].includes(breakpoints) && (
                <SpecificalPaymentAdditional sx={{ order: 3 }} />
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
};
