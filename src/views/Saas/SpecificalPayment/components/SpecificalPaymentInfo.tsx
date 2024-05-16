import { FC, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar } from '@/utils';
import { DashboardPaymentDetailsResponse } from '@/types';

export const SpecificalPaymentInfo: FC<
  Partial<DashboardPaymentDetailsResponse> & {
    additional?: ReactNode;
  }
> = ({
  propertyAddress,
  productName,
  appraisalFees,
  //isExpedited,
  //expeditedFees,
  paymentAmount,
  additional,
}) => {
  return (
    <>
      <Stack
        border={'1px solid #E4E7EF'}
        borderRadius={2}
        //gap={3}
        p={3}
        width={'100%'}
      >
        <Typography fontSize={24} variant="h4">
          Order summary
        </Typography>
        <Stack gap={1} mt={1}>
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
          mt={3}
          pb={1}
        >
          <Typography variant={'subtitle2'}>Appraisal fee</Typography>
          <Typography variant={'body2'}>
            {POSFormatDollar(appraisalFees)}
          </Typography>
        </Stack>
        {/*{isExpedited && (*/}
        {/*  <Stack*/}
        {/*    alignItems={'center'}*/}
        {/*    borderBottom={'1px solid #E4E7EF'}*/}
        {/*    flexDirection={'row'}*/}
        {/*    justifyContent={'space-between'}*/}
        {/*    mt={3}*/}
        {/*    pb={1}*/}
        {/*  >*/}
        {/*    <Typography variant={'subtitle2'}>Expedited</Typography>*/}
        {/*    <Typography variant={'body2'}>*/}
        {/*      {POSFormatDollar(expeditedFees)}*/}
        {/*    </Typography>*/}
        {/*  </Stack>*/}
        {/*)}*/}
        <Typography
          color={'primary.main'}
          mt={1}
          textAlign={'right'}
          variant={'h6'}
        >
          Total:{' '}
          <Typography
            color={'primary.main'}
            component={'span'}
            textAlign={'right'}
            variant={'h5'}
          >
            {POSFormatDollar(paymentAmount)}
          </Typography>
        </Typography>
      </Stack>
      {additional && additional}
    </>
  );
};
