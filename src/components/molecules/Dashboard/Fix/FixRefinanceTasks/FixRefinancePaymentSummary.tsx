import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';
import { FRRatesLoanInfo, RatesProductData } from '@/types';

interface FixRefinancePaymentSummaryProps {
  productInfo:
    | (FRRatesLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm'
        >)
    | undefined;
}

export const FixRefinancePaymentSummary: FC<
  FixRefinancePaymentSummaryProps
> = ({
  productInfo = {
    interestRateOfYear: undefined,
    loanTerm: undefined,
    totalLoanAmount: undefined,
    balance: undefined,
    cashOutAmount: undefined,
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
          <Typography variant={'body1'}>Payoff amount</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.balance)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Cash out amount</Typography>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(productInfo?.cashOutAmount)}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Rehab loan amount</Typography>
          <Typography variant={'subtitle1'}>
            {productInfo?.cor ? POSFormatDollar(productInfo.cor) : 'N/A'}
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
