import { Stack, SxProps, Typography } from '@mui/material';
import { FC } from 'react';

export const SpecificalPaymentAdditional: FC<{ sx?: SxProps }> = ({
  ...rest
}) => {
  return (
    <Stack color={'#636A7C'} gap={{ xs: 1.5, md: 3 }} {...rest}>
      <Typography color={'#9095A3'} variant={'subtitle1'}>
        What happens next
      </Typography>
      <Stack gap={1}>
        <Typography variant={'body3'}>Once you pay:</Typography>
        <Typography variant={'body3'}>
          After you pay, we&apos;ll contact you to set a date for your
          property&apos;s appraisal.
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography variant={'body3'}>Appraisal visit:</Typography>
        <Typography variant={'body3'}>
          An expert will come by to check your property&apos;s value, which may
          include looking inside your home.
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography variant={'body3'}>Heads up:</Typography>
        <Typography variant={'body3'}>
          Federal law says you need a carbon monoxide detector and a secure
          water heater. Make sure these are in place to avoid issues.
        </Typography>
      </Stack>
    </Stack>
  );
};
