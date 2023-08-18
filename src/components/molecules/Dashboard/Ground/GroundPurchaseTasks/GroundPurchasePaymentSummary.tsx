import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';
import { GPRatesLoanInfo, RatesProductData } from '@/types';

interface GroundPurchasePaymentSummaryProps {
  productInfo:
    | (GPRatesLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm'
        >)
    | undefined;
}

export const GroundPurchasePaymentSummary: FC<
  GroundPurchasePaymentSummaryProps
> = ({
  productInfo = {
    interestRateOfYear: undefined,
    loanTerm: undefined,
    purchasePrice: undefined,
    purchaseLoanAmount: undefined,
    cor: undefined,
    paymentOfMonth: undefined,
  },
}) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'info.A100'}
      borderRadius={2}
      color={'text.white'}
      gap={1.5}
      maxWidth={600}
      p={3}
      width={'100%'}
    >
      <Typography variant={'h4'}>Your Rate</Typography>
      <Stack width={'100%'}>
        <Stack
          alignItems={'center'}
          borderBottom={'1px solid white'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Interest Rate</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatLocalPercent(productInfo?.interestRateOfYear)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Loan Term</Typography>
          <Typography variant={'subtitle1'}>
            {productInfo?.loanTerm} months
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Purchase Loan Amount</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.purchaseLoanAmount)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Rehab Loan Amount</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.cor)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Total Loan Amount</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.totalLoanAmount)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Monthly Payment</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.paymentOfMonth)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
