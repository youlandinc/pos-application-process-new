import { ChangeEvent, forwardRef, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { SPaymentDetails } from '@/requests/dashboard';

import {
  StyledCheckbox,
  StyledFormItem,
  StyledPaymentCard,
  StyledPaymentCardRef,
} from '@/components/atoms';
import { SpecificalPaymentInfo } from '@/views/SpecificalPayment/components';

interface PaymentTableProps {
  paymentDetail: SPaymentDetails | undefined;
  loading?: boolean;
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanDetail?: ReactNode;
  productType?: ProductCategory;
}

export const PaymentMethods = forwardRef<
  StyledPaymentCardRef,
  PaymentTableProps
>(({ paymentDetail, check, onCheckValueChange }, ref) => {
  return (
    <StyledFormItem
      alignItems={'center'}
      gap={3}
      label={'Complete your appraisal payment below'}
      px={{ lg: 3, xs: 0 }}
    >
      <SpecificalPaymentInfo {...paymentDetail} />

      <Stack border={'1px solid #E4E7EF'} borderRadius={2} p={3} width={'100%'}>
        <StyledPaymentCard
          hideFooter={true}
          ref={ref}
          secret={paymentDetail?.clientSecret}
        />
      </Stack>

      <StyledCheckbox
        checked={check}
        label={
          <>
            <b>Important: </b> By proceeding, you acknowledge that if your
            property doesn&apos;t meet the required standards at the time of the
            inspection, you&apos;ll be responsible for the cost of a second
            appraisal.
          </>
        }
        onChange={onCheckValueChange}
        sx={{ mr: 1, mt: 3 }}
      />

      <Stack gap={1} width={'100%'}>
        <Typography color={'info.dark'} fontWeight={500} variant={'body3'}>
          Appraisal visit:
        </Typography>
        <Typography color={'info.dark'} variant={'body3'}>
          An expert will come by to check your property&apos;s value, which may
          include looking inside your home.
        </Typography>
      </Stack>

      <Stack gap={1} width={'100%'}>
        <Typography color={'info.dark'} fontWeight={500} variant={'body3'}>
          Heads up:
        </Typography>
        <Typography color={'info.dark'} variant={'body3'}>
          Federal law says you need a carbon monoxide detector and a secure
          water heater. Make sure these are in place to avoid issues.
        </Typography>
      </Stack>
    </StyledFormItem>
  );
});
