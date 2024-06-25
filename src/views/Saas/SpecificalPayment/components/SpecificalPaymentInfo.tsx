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
  isExpedited,
  expeditedFees,
  paymentAmount,
  additional,
  paymentName,
  isAdditional,
}) => {
  return (
    <>
      <Stack border={'1px solid #E4E7EF'} borderRadius={2} p={3} width={'100%'}>
        <Typography fontSize={{ xs: 18, md: 24 }} variant={'h5'}>
          Order summary
        </Typography>
        <Stack gap={1} mt={1}>
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 12, md: 14 }}
            variant={'body2'}
          >
            Property address: {propertyAddress}
          </Typography>
          {paymentName && (
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 12, md: 14 }}
              variant={'body2'}
            >
              Type: {productName}
            </Typography>
          )}
        </Stack>
        {isAdditional ? (
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #E4E7EF'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            mt={{ xs: 1.5, md: 3 }}
            pb={1}
          >
            <Typography variant={'subtitle2'}>{paymentName}</Typography>
            <Typography variant={'body2'}>
              {POSFormatDollar(paymentAmount)}
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack
              alignItems={'center'}
              borderBottom={'1px solid #E4E7EF'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              mt={3}
              pb={1.5}
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
                mt={1.5}
                pb={1.5}
              >
                <Typography variant={'subtitle2'}>Expedited</Typography>
                <Typography variant={'body2'}>
                  {POSFormatDollar(expeditedFees)}
                </Typography>
              </Stack>
            )}
          </>
        )}

        <Typography
          color={'primary.main'}
          fontSize={{ xs: 18, md: 24 }}
          mt={1.5}
          textAlign={'right'}
          variant={'h6'}
        >
          Total: {POSFormatDollar(paymentAmount)}
        </Typography>
      </Stack>
      {additional && additional}
    </>
  );
};
