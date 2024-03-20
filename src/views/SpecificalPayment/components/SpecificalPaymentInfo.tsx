import { FC, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar } from '@/utils';
import { SPaymentDetails } from '@/requests/dashboard';

export const SpecificalPaymentInfo: FC<
  Partial<SPaymentDetails> & {
    additional?: ReactNode;
  }
> = ({
  propertyAddress,
  productName,
  appraisalFees,
  isExpedited,
  expeditedFees,
  paymentAmount,
  additional,
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
          Order summary
        </Typography>
        <Stack gap={1.25}>
          <Typography variant={'body2'}>
            Property address: {propertyAddress}
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
      {additional && additional}
    </>
  );
};
