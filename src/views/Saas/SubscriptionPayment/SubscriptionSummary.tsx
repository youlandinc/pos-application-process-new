import { FC, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar } from '@/utils';

export const SubscriptionSummary: FC<{
  additional?: ReactNode;
}> = ({ additional }) => {
  return (
    <>
      <Stack border={'1px solid #E4E7EF'} borderRadius={2} p={3} width={'100%'}>
        <Typography fontSize={{ xs: 16, md: 20 }} variant={'h5'}>
          Order summary
        </Typography>
        <Stack gap={1} mt={1}>
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 12, md: 14 }}
            variant={'body2'}
          >
            Subscription plan: Standard
          </Typography>
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 12, md: 14 }}
            variant={'body2'}
          >
            Billing period: June 1 - June 30, 2025
          </Typography>
        </Stack>
        <Stack
          alignItems={'center'}
          borderBottom={'1px solid #E4E7EF'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          mt={{ xs: 1.5, md: 3 }}
          pb={1}
        >
          <Typography variant={'subtitle2'}>Standard Plan for June</Typography>
          <Typography variant={'body2'}>{POSFormatDollar(300)}</Typography>
        </Stack>

        <Typography
          color={'primary.main'}
          fontSize={{ xs: 18, md: 24 }}
          mt={3}
          textAlign={'right'}
          variant={'h6'}
        >
          Total: {POSFormatDollar(300)}
        </Typography>
      </Stack>

      {additional && additional}
    </>
  );
};
