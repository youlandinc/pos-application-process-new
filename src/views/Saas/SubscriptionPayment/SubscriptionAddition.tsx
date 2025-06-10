import { Stack, SxProps, Typography } from '@mui/material';
import { FC } from 'react';

export const SubscriptionAddition: FC<{ sx?: SxProps }> = ({ ...rest }) => {
  return (
    <Stack color={'#636A7C'} gap={{ xs: 1.5, md: 3 }} {...rest}>
      <Typography color={'#9095A3'} variant={'subtitle1'}>
        What happens next
      </Typography>
      <Stack gap={1}>
        <Typography fontWeight={600} variant={'body3'}>
          Once you pay:
        </Typography>
        <Typography variant={'body3'}>
          Your account is live for the full billing period. We’ll email a
          receipt within minutes.
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography fontWeight={600} variant={'body3'}>
          Heads up:
        </Typography>
        <Typography variant={'body3'}>
          Auto-renewing payments will go live in 1–2 months. Until then, we’ll
          email you a secure payment link near the end of each month to pay for
          the next month’s service.
        </Typography>
      </Stack>

      <Typography variant={'body3'}>
        Need to change or cancel? Just reply to that email before you pay.
      </Typography>
    </Stack>
  );
};
