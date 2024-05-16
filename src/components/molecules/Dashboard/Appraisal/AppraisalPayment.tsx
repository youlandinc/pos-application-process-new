import React, { forwardRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledCheckbox,
  StyledFormItem,
  StyledPaymentCard,
  StyledPaymentCardRef,
} from '@/components/atoms';
import { SpecificalPaymentInfo } from '@/views/Saas/SpecificalPayment/components';
import { DashboardPaymentDetailsResponse } from '@/types';

interface PaymentTableProps {
  paymentDetail: DashboardPaymentDetailsResponse | undefined;
  backStep: () => void;
  backState: boolean;
  nextState: boolean;
  nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const AppraisalPayment = forwardRef<
  StyledPaymentCardRef,
  PaymentTableProps
>(({ paymentDetail, backStep, nextState, nextStep, backState }, ref) => {
  const [checkProcessing, setCheckProcessing] = useState(false);

  return (
    <StyledFormItem
      alignItems={'center'}
      gap={3}
      label={'Complete your appraisal payment below'}
      labelSx={{ textAlign: 'center' }}
      px={{ lg: 3, xs: 0 }}
    >
      <Stack mt={3} width={'100%'}>
        <SpecificalPaymentInfo {...paymentDetail} />
      </Stack>

      <Stack
        border={'1px solid #E4E7EF'}
        borderRadius={2}
        p={'12px 24px 24px 24px'}
        width={'100%'}
      >
        <StyledPaymentCard
          hideFooter={true}
          ref={ref}
          secret={paymentDetail?.clientSecret}
        />
      </Stack>

      <StyledCheckbox
        checked={checkProcessing}
        label={
          <>
            <b>Important: </b> By proceeding, you acknowledge that if your
            property doesn&apos;t meet the required standards at the time of the
            inspection, you&apos;ll be responsible for the cost of a second
            appraisal. Furthermore, certain property types (rural, large
            property size) or urgent requests may require additional payments.
          </>
        }
        onChange={(e) => {
          setCheckProcessing(e.target.checked);
        }}
        sx={{
          mr: 1,
          mt: 2.5,
          '& .MuiCheckbox-root': {
            mt: '-9px',
            mr: '-9px',
          },
        }}
      />

      <Stack gap={1.5} mt={2.5} width={'100%'}>
        <Typography
          color={'info.dark'}
          component={'div'}
          fontWeight={600}
          variant={'body3'}
        >
          Appraisal visit:
          <Typography color={'info.dark'} component={'div'} variant={'body3'}>
            An expert will come by to check your property&apos;s value, which
            may include looking inside your home.
          </Typography>
        </Typography>

        <Typography
          color={'info.dark'}
          component={'div'}
          fontWeight={600}
          variant={'body3'}
        >
          Heads up:
          <Typography color={'info.dark'} component={'div'} variant={'body3'}>
            Federal law says you need a carbon monoxide detector and a secure
            water heater. Make sure these are in place to avoid issues.
          </Typography>
        </Typography>
      </Stack>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
        maxWidth={600}
        mt={8}
        mx={'auto'}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          disabled={backState}
          loading={backState}
          onClick={backStep}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton
          color={'primary'}
          disabled={!checkProcessing || nextState}
          loading={nextState}
          onClick={nextStep}
          sx={{ flex: 1 }}
        >
          Pay now
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
