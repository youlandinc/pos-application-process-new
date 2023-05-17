import { FC } from 'react';
import { Box } from '@mui/material';

import { POSFlex, POSFont } from '@/styles';
import { BPRatesLoanInfo } from '@/types';
import { StyledLoading } from '@/components/atoms';
import {
  PaymentTaskBaseComponentProps,
  ProductItem,
} from '@/components/molecules';
import { POSFormatDollar, POSFormatLocalPercent } from '@/utils';

const useStyle = {
  '&.paymentBox': {
    background: '#FFFFFF',
    boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.15)',
    borderRadius: 8,
    padding: '24px 48px',
  },
  '& .paymentBoxTitle': {
    color: 'background: rgba(0, 0, 0, 0.87)',
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  '& .paymentInfoBox': {
    marginTop: 24,
  },
  '& .paymentInfoItem': {
    ...POSFlex('center', 'space-between', 'row'),
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.6)'),
    padding: '12px 0',
  },
};

interface BPPaymentSummary
  extends PaymentTaskBaseComponentProps<BPRatesLoanInfo> {
  loading?: boolean;
}

export const BPPaymentSummary: FC<BPPaymentSummary> = (props) => {
  const { loading, loanInfo, productInfo } = props;

  return (
    <Box className={'paymentBox'} sx={useStyle}>
      {loading ? (
        <StyledLoading />
      ) : (
        <>
          <Box className={'paymentBoxTitle'}>Your rate</Box>
          <Box className={'paymentInfoBox'}>
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {POSFormatLocalPercent(productInfo?.interestRateOfYear)}
                </Box>
              }
              label={'Rate'}
            />
            <ProductItem
              borderBottom={'1px solid #C4C4C4'}
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {productInfo?.loanTerm} months
                </Box>
              }
              label={'Loan term'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {POSFormatDollar(loanInfo?.purchaseLoanAmount)}
                </Box>
              }
              label={'Purchase loan amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {POSFormatDollar(loanInfo?.cor)}
                </Box>
              }
              label={'Rehab loan amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {POSFormatDollar(loanInfo?.totalLoanAmount)}
                </Box>
              }
              label={'Total loan amount'}
            />
            <ProductItem
              className={'paymentInfoItem'}
              info={
                <Box fontSize={20} fontWeight={700}>
                  {POSFormatDollar(productInfo?.paymentOfMonth)}
                </Box>
              }
              label={'Monthly payment'}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
