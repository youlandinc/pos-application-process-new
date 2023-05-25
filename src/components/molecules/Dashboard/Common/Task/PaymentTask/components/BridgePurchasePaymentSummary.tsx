import { FC } from 'react';
import { Box, SxProps } from '@mui/material';

import { POSFlex, POSFont } from '@/styles';
import { BridgePurchaseRatesLoanInfo } from '@/types';
import { StyledLoading } from '@/components/atoms';
import {
  PaymentTaskBaseComponentProps,
  ProductItem,
} from '@/components/molecules';
import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';

const useStyle: SxProps = {
  bgcolor: 'info.A100',
  width: '100%',

  borderRadius: 2,
  p: 3,
  color: 'text.white',
  '& .paymentBoxTitle': {
    textAlign: 'center',
    ...POSFont(24, 700, 1.5, 'text.white'),
  },
  '& .paymentInfoBox': {
    mt: 3,
  },
  '& .paymentInfoItem': {
    ...POSFlex('center', 'space-between', 'row'),
    ...POSFont(16, 400, 1.5, 'text.white'),
    padding: '12px 0',
    '& .info, & .label': {
      color: 'text.white',
    },
  },
};

interface BridgePurchasePaymentSummary
  extends PaymentTaskBaseComponentProps<BridgePurchaseRatesLoanInfo> {
  loading?: boolean;
}

export const BridgePurchasePaymentSummary: FC<BridgePurchasePaymentSummary> = (
  props,
) => {
  const { loading, loanInfo, productInfo } = props;

  return (
    <Box className={'paymentBox'} sx={useStyle}>
      {loading ? (
        <StyledLoading />
      ) : (
        <>
          <Box className={'paymentBoxTitle'}>Your Rate</Box>
          <Box className={'paymentInfoBox'}>
            <ProductItem
              borderBottom={'1px solid #C4C4C4'}
              className={'paymentInfoItem'}
              info={
                <Box fontSize={24} fontWeight={700}>
                  {POSFormatLocalPercent(productInfo?.interestRateOfYear)}
                </Box>
              }
              label={'Rate'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={16} fontWeight={600}>
                  {productInfo?.loanTerm} months
                </Box>
              }
              label={'Loan Term'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={16} fontWeight={600}>
                  {POSFormatDollar(loanInfo?.purchaseLoanAmount)}
                </Box>
              }
              label={'Purchase Loan Amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={16} fontWeight={600}>
                  {POSFormatDollar(loanInfo?.cor)}
                </Box>
              }
              label={'Rehab Loan Amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={16} fontWeight={600}>
                  {POSFormatDollar(loanInfo?.totalLoanAmount)}
                </Box>
              }
              label={'Total Loan Amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={16} fontWeight={600}>
                  {POSFormatDollar(productInfo?.paymentOfMonth)}
                </Box>
              }
              label={'Monthly Payment'}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
