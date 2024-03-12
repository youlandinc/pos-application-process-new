import { Stack, Typography } from '@mui/material';
import { POSFormatDollar } from '@/utils';
import { FC } from 'react';

export const SpecificalPaymentInfo: FC<{
  propertyAddress: string | undefined;
  productName: string | undefined;
  appraisalFees: number | string | undefined;
  isExpedited: boolean | undefined;
  expeditedFees: number | string | undefined;
  paymentAmount: number | string | undefined;
}> = ({
  propertyAddress,
  productName,
  appraisalFees,
  isExpedited,
  expeditedFees,
  paymentAmount,
}) => {
  return (
    <>
      <Stack
        border={'1px solid #E4E7EF'}
        borderRadius={2}
        gap={3}
        p={3}
        width={'100%'}
      >
        <Typography fontSize={24} pb={1.25} variant="h4">
          Order Summary
        </Typography>
        <Stack gap={1.25}>
          <Typography variant={'body2'}>
            Property address:{propertyAddress}
          </Typography>
          <Typography variant={'body2'}>Type: {productName}</Typography>
        </Stack>
        <Stack
          alignItems={'center'}
          borderBottom={'1px solid #E4E7EF'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          mt={5}
          pb={1}
        >
          <Typography variant={'subtitle2'}>Appraisal fee</Typography>
          <Typography variant={'body2'}>
            {POSFormatDollar(appraisalFees)}
          </Typography>
        </Stack>
        {isExpedited && (
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #E4E7EF'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            mt={3}
            pb={1}
          >
            <Typography variant={'subtitle2'}>Expedited</Typography>
            <Typography variant={'body2'}>
              {POSFormatDollar(expeditedFees)}
            </Typography>
          </Stack>
        )}
        <Typography color={'#365EC6'} textAlign={'right'} variant={'h6'}>
          Total: {POSFormatDollar(paymentAmount)}
        </Typography>
      </Stack>

      <Stack color={'#636A7C'} gap={3}>
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
            An expert will come by to check your property&apos;s value, which
            may include looking inside your home.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Typography variant={'body3'}>
            Heads up for California homes:
          </Typography>
          <Typography variant={'body3'}>
            State law says you need a carbon monoxide detector and a secure
            water heater. Make sure these are in place to avoid issues.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};
