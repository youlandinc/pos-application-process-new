import { ChangeEvent, forwardRef, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import { PaymentTaskBaseComponentProps } from '@/components/molecules';
import { SPaymentDetails } from '@/requests/dashboard';
import {
  StyledCheckbox,
  StyledFormItem,
  StyledPaymentCard,
  StyledPaymentCardRef,
} from '@/components/atoms';
import { POSFlex, POSFont } from '@/styles';

const PaymentTableStyle = {
  '&.container': {
    ...POSFlex('center', 'center', 'column'),
  },
  '& .title': {
    ...POSFont(36, 700, 1, 'rgba(0,0,0,.87)'),
    // mt: 9,
  },
  '& .titleAddition': {
    mt: 1.5,
    color: 'rgba(0,0,0,.6)',
  },
  '& .subTitle': {
    ...POSFont(24, 400, 1.5, 'rgba(0,0,0,.87)'),
    mt: 6,
    overflow: 'hidden',
  },
  '& .subTitleAddition': {
    mt: 1,
    color: 'rgba(0,0,0,.6)',
  },
  subTitleAdditionBox: {},
  '& .subTitleAdditionLi': {
    display: 'flex',
    color: 'rgba(0,0,0,.6)',
  },
  '& .paymentOrderBox': {
    // ...POSFlex('center', 'center', 'row'),
    mt: 6,
    width: '100%',
    maxWidth: 600,
  },
  '& .confirmBox': {
    mt: 6,
    marginLeft: 0,
    width: '100%',
    fontSize: 16,
    color: 'rgba(0,0,0,.38)',
    cursor: 'pointer',
    userSelect: 'none',
    alignItems: 'flex-start',
    '& .MuiButtonBase-root': {
      mt: 1,
    },
  },
};

interface PaymentTableProps extends PaymentTaskBaseComponentProps {
  paymentDetail: SPaymentDetails;
  loading?: boolean;
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanDetail: ReactNode;
  productType: ProductCategory;
}

export const PaymentTable = forwardRef<StyledPaymentCardRef, PaymentTableProps>(
  (props, ref) => {
    const {
      paymentDetail,
      check,
      onCheckValueChange,
      loanDetail,
      // productType,
    } = props;
    // const tenantConfig = utils.getTenantConfig();

    return (
      <StyledFormItem
        alignItems={'center'}
        label={'You need to make payment of $' + paymentDetail?.amount}
        sx={PaymentTableStyle}
        tip={
          <>
            <Typography color={'info.main'} variant={'body1'}>
              Please pay the appraisal cost of ${paymentDetail?.amount} by{' '}
              {'{today+3days}'}, We will help you lock the rate upon receipt of
              payment.
            </Typography>
            <Typography color={'info.main'} mt={1.5} variant={'body1'}>
              We’ll reach out to schedule your appraisal, which is when someone
              visits the property to determine its value, if an interior
              inspection is needed.
            </Typography>
            <Typography color={'info.main'} mt={1.5} variant={'body1'}>
              California law requires that all residential properties be
              equipped with both a mounted carbon monoxide detector and a
              double-strapped water heater.
            </Typography>
          </>
        }
      >
        <Box className={'paymentOrderBox'}>
          <Box flex={1} marginRight={'24px'}>
            {loanDetail}
          </Box>
          <StyledPaymentCard
            amount={paymentDetail?.amount}
            ref={ref}
            secret={paymentDetail?.clientSecret}
          />
        </Box>

        <StyledCheckbox
          checked={check}
          label={
            'Important: I understand that if my home does not meet these requirements at the time of inspection, I will be required to pay for a second appraisal inspection.'
          }
          onChange={onCheckValueChange}
          sx={{ mr: 1, maxWidth: 600, mt: 3 }}
        />
      </StyledFormItem>
    );
  },
);
