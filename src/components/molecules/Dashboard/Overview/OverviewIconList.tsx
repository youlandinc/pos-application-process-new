import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useMst } from '@/models/Root';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { useSessionStorageState } from '@/hooks';

import LOGO_1 from '@/svg/dashboard/overview_logo_1.svg';
import LOGO_2 from '@/svg/dashboard/overview_logo_2.svg';
import LOGO_3 from '@/svg/dashboard/overview_logo_3.svg';
import { UserType } from '@/types';

interface OverviewIconListProps {
  totalLoanAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
  compensationFee?: number;
}

export const OverviewIconList: FC<OverviewIconListProps> = ({
  totalLoanAmount,
  interestRate,
  monthlyPayment,
  compensationFee,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const { userType } = useMst();

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
        {userType === UserType.CUSTOMER ? (
          <Stack gap={0.5}>
            <Typography color={'text.secondary'} variant={'body3'}>
              Monthly payment
            </Typography>
            <Typography color={'text.primary'} variant={'h5'}>
              {POSFormatDollar(monthlyPayment, 2)}
            </Typography>
          </Stack>
        ) : (
          <Stack gap={0.5}>
            <Typography color={'text.secondary'} variant={'body3'}>
              Total compensation
            </Typography>
            <Typography color={'text.primary'} variant={'h5'}>
              {POSFormatDollar(compensationFee, 2)}
            </Typography>
          </Stack>
        )}

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
