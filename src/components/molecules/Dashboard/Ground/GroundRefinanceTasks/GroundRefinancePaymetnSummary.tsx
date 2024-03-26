import { useSessionStorageState } from '@/hooks';
import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';
import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';
import { GRRatesLoanInfo, RatesProductData } from '@/types';

interface GroundRefinancePaymentSummaryProps {
  productInfo:
    | (GRRatesLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm'
        >)
    | undefined;
}

export const GroundRefinancePaymentSummary: FC<
  GroundRefinancePaymentSummaryProps
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
        Ground-up Construction | Refinance
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
