import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useSessionStorageState } from '@/hooks';

import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';
import { BPRatesLoanInfo, RatesProductData } from '@/types';

import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';

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
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#FFFFFF'}
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      color={'text.primary'}
      gap={1.5}
      maxWidth={600}
      p={3}
      width={'100%'}
    >
      <Typography variant={'h7'} width={'100%'}>
        Stabilized Bridge ｜ Purchase
      </Typography>
      <Icon
        component={RATE_CURRENT}
        sx={{
          width: 184,
          height: 146,
          mt: 1.5,
          '& .rate_current_svg__pos_svg_theme_color,& .rate_confirmed_svg__pos_svg_theme_color ':
            {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
            },
        }}
      />
      <Stack width={'100%'}>
        <Stack
          alignItems={'center'}
          borderBottom={'1px solid #D2D6E1'}
          flex={1}
          flexDirection={'row'}
          justifyContent={'space-between'}
          py={1.5}
        >
          <Typography variant={'body1'}>Interest rate</Typography>
          <Typography variant={'h4'}>
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
          <Typography variant={'body1'}>Loan duration</Typography>
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
