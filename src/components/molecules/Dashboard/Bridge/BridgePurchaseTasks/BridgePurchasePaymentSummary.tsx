import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';
import { BPRatesLoanInfo, RatesProductData } from '@/types';

interface BridgePurchasePaymentSummaryProps {
  productInfo:
    | (BPRatesLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm'
        >)
    | undefined;
}

export const BridgePurchasePaymentSummary: FC<
  BridgePurchasePaymentSummaryProps
> = ({
  productInfo = {
    interestRateOfYear: undefined,
    loanTerm: undefined,
    purchasePrice: undefined,
    purchaseLoanAmount: undefined,
    paymentOfMonth: undefined,
  },
}) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'info.dark'}
      borderRadius={2}
      color={'text.white'}
      gap={1.5}
      maxWidth={600}
      p={3}
      width={'100%'}
    >
      <Typography variant={'h4'}>Your rate</Typography>
      <Stack width={'100%'}>
        <Stack
          alignItems={'center'}
          borderBottom={'1px solid white'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Interest rate</Typography>
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
          <Typography variant={'body1'}>Loan term</Typography>
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
          <Typography variant={'body1'}>Purchase loan amount</Typography>
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
          <Typography variant={'body1'}>Total loan amount</Typography>
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
          <Typography variant={'body1'}>Monthly payment</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.paymentOfMonth)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
