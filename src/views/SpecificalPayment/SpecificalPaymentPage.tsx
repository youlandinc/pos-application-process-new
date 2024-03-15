import { useCallback, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
import { addDays, format } from 'date-fns';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFormatDollar, POSGetParamsFromUrl } from '@/utils';

import { HttpError } from '@/types';

import {
  StyledHeaderLogo,
  StyledLoading,
  StyledPaymentCard,
} from '@/components/atoms';

import {
  SpecificalPaymentAdditional,
  SpecificalPaymentInfo,
  SpecificalPaymentStatus,
} from './components';

import { _creatSpecifyPayment } from '@/requests';
import { useBreakpoints } from '@/hooks';

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
  const [closeDate, setCloseDate] = useState<any>();

  const [paymentStatus, setPaymentStatus] = useState('');

  const onButtonClick = useCallback(() => {
    if (paymentStatus === 'requires_payment_method') {
      return setPaymentStatus('');
    }
    return (window.location.href = 'https://www.youland.com');
  }, [paymentStatus]);

  const { loading } = useAsync(async () => {
    const { id, email } = POSGetParamsFromUrl(location.href);
    if (!id || !email) {
      return;
    }
    try {
      const {
        data: {
          clientSecret,
          propertyAddress,
          productName,
          paymentAmount,
          isExpedited,
          appraisalFees,
          expeditedFees,
          created,
        },
      } = await _creatSpecifyPayment({
        id: parseInt(id),
        receiptEmail: email,
      });
      setClientSecret(clientSecret);
      setProductName(productName);
      setPropertyAddress(propertyAddress);

      setAppraisalFees(appraisalFees);
      setIsExpedited(isExpedited);
      setExpeditedFees(expeditedFees);
      setPaymentAmount(paymentAmount);

      setCloseDate(
        typeof created === 'number'
          ? format(addDays(created, 3), 'MMMM dd, yyyy')
          : format(new Date(), 'MMMM dd, yyyy'),
      );
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
              gap={6}
              px={{
                lg: 0,
                xs: 'clamp(24px,6.4vw,80px)',
              }}
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
                <Typography variant={'h4'}>
                  Complete your appraisal payment
                </Typography>

                <Typography variant={'body2'}>
                  To move forward with your loan application, an appraisal fee
                  of {POSFormatDollar(appraisalFees)} is due by {closeDate}
                </Typography>
                <StyledPaymentCard
                  cb={(status) => {
                    setPaymentStatus(status);
                  }}
                  mode={'uncheck'}
                  secret={clientSecret}
                />
              </Stack>

              <Stack
                flexShrink={0}
                gap={6}
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
