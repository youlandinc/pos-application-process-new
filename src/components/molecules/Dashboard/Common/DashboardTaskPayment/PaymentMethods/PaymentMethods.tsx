import { AchPaymentCard, RealTimePayment } from '@/components/organisms';
import { StyledTab } from '@/components/atoms';
import { ChangeEvent, forwardRef, ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import { SPaymentDetails } from '@/requests/dashboard';

import {
  StyledCheckbox,
  StyledFormItem,
  StyledPaymentCard,
  StyledPaymentCardRef,
} from '@/components/atoms';

interface PaymentTableProps {
  paymentDetail: SPaymentDetails | undefined;
  loading?: boolean;
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanDetail?: ReactNode;
  productType?: ProductCategory;
}

export const PaymentMethods = forwardRef<
  StyledPaymentCardRef,
  PaymentTableProps
>((props, ref) => {
  const {
    paymentDetail,
    check,
    onCheckValueChange,
    // productType,
  } = props;

  const tabs = [
    {
      label: 'Pay by credit card',
      content: (
        <StyledPaymentCard
          amount={paymentDetail?.amount}
          ref={ref}
          secret={paymentDetail?.clientSecret}
        />
      ),
    },
    {
      label: 'ACH transfer',
      content: <AchPaymentCard />,
    },
    {
      label: 'Real-time payment',
      content: <RealTimePayment />,
    },
  ];

  return (
    <StyledFormItem
      alignItems={'center'}
      gap={3}
      label={'You need to make payment of $' + paymentDetail?.amount}
      px={{ lg: 3, xs: 0 }}
      tip={
        <>
          <Typography color={'info.main'} variant={'body1'}>
            Please pay the appraisal cost of ${paymentDetail?.amount} by{' '}
            <Box
              component={'span'}
              sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
            >
              {format(new Date(), 'MM/dd/yyyy')}
            </Box>
            , We will help you confirm the rate upon receipt of payment.
          </Typography>
          <Typography color={'info.main'} mt={1.5} variant={'body1'}>
            California law requires that all residential properties be equipped
            with both a mounted carbon monoxide detector and a double-strapped
            water heater.
          </Typography>
        </>
      }
      tipSx={{ m: 0 }}
    >
      <Stack maxWidth={900} width={'100%'}>
        <StyledTab
          sx={{
            mb: 1.5,
            '& .MuiButtonBase-root': {
              fontWeight: 600,
            },
          }}
          tabsData={tabs}
        />
      </Stack>

      <StyledCheckbox
        checked={check}
        label={
          'Important: I understand that if my home does not meet these requirements at the time of inspection, I will be required to pay for a second appraisal inspection.'
        }
        onChange={onCheckValueChange}
        sx={{ mr: 1, mt: 3 }}
      />
    </StyledFormItem>
  );
});
