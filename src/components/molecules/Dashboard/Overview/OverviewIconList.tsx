import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { useSessionStorageState } from '@/hooks';

import LOGO_1 from '@/svg/dashboard/overview_logo_1.svg';
import LOGO_2 from '@/svg/dashboard/overview_logo_2.svg';
import LOGO_3 from '@/svg/dashboard/overview_logo_3.svg';

interface OverviewIconListProps {
  totalLoanAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
}

export const OverviewIconList: FC<OverviewIconListProps> = ({
  totalLoanAmount,
  interestRate,
  monthlyPayment,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <Stack flexDirection={{ xs: 'column', xl: 'row' }} gap={3} width={'100%'}>
      <Stack
        alignItems={'center'}
        border={'1px solid #D2D6E1'}
        borderRadius={2}
        // flex={1}
        flexDirection={'row'}
        justifyContent={'space-between'}
        p={3}
        width={{ xs: '100%', xl: 'calc(33.33% - 12px)' }}
      >
        <Stack gap={0.5}>
          <Typography color={'text.secondary'} variant={'body3'}>
            Total loan amount
          </Typography>
          <Typography color={'text.primary'} variant={'h5'}>
            {POSFormatDollar(totalLoanAmount)}
          </Typography>
        </Stack>
        <Icon
          component={LOGO_1}
          sx={{
            width: 54,
            height: 54,
            '& .overview_logo_1_svg__pos_svg_theme_color_lighter': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},100%,97%,1)`,
            },
            '& .overview_logo_1_svg__pos_svg_theme_color_darker': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},38%,30%,1)`,
            },
          }}
        />
      </Stack>

      <Stack
        alignItems={'center'}
        border={'1px solid #D2D6E1'}
        borderRadius={2}
        // flex={1}
        flexDirection={'row'}
        justifyContent={'space-between'}
        p={3}
        width={{ xs: '100%', xl: 'calc(33.33% - 12px)' }}
      >
        <Stack gap={0.5}>
          <Typography color={'text.secondary'} variant={'body3'}>
            Interest rate
          </Typography>
          <Typography color={'text.primary'} variant={'h5'}>
            {POSFormatPercent(interestRate)}
          </Typography>
        </Stack>
        <Icon
          component={LOGO_2}
          sx={{
            width: 54,
            height: 54,
            '& .overview_logo_2_svg__pos_svg_theme_color_lighter': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},100%,97%,1)`,
            },
            '& .overview_logo_2_svg__pos_svg_theme_color_darker': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},38%,30%,1)`,
            },
          }}
        />
      </Stack>

      <Stack
        alignItems={'center'}
        border={'1px solid #D2D6E1'}
        borderRadius={2}
        // flex={1}
        flexDirection={'row'}
        justifyContent={'space-between'}
        p={3}
        width={{ xs: '100%', xl: 'calc(33.33% - 12px)' }}
      >
        <Stack gap={0.5}>
          <Typography color={'text.secondary'} variant={'body3'}>
            Monthly payment
          </Typography>
          <Typography color={'text.primary'} variant={'h5'}>
            {POSFormatDollar(monthlyPayment)}
          </Typography>
        </Stack>
        <Icon
          component={LOGO_3}
          sx={{
            width: 54,
            height: 54,
            '& .overview_logo_3_svg__pos_svg_theme_color_lighter': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},100%,97%,1)`,
            },
            '& .overview_logo_3_svg__pos_svg_theme_color_darker': {
              fill: `hsla(${saasState?.posSettings?.h ?? 222},38%,30%,1)`,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};
