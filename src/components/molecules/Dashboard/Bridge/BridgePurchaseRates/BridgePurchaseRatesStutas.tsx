import React, { FC, useMemo, useState } from 'react';
import Image from 'next/image';
import { Box, Divider, CircularProgress, makeStyles } from '@material-ui/core';
import { useAsync } from 'react-use';

import { utils } from '@/common/utils';
import { POSFlex, POSFont } from '@/common/styles/global';
import { LoanStage } from '@/types/enum';
import { Encompass } from '@/types/variable';
import { RatesBPLoanInfo, RatesProductData } from '@/types/dashboardData';
import { _fetchRatesProductSelected } from '@/requests/dashboard';
import { FormItem, ProductItem } from '@/components/molecules';

const useStyles = makeStyles({
  container: {
    width: '100%',
    padding: '48px 7.5vw',
    ...POSFlex('flex-start', 'center', 'column'),
  },
  title: {
    marginBlockStart: 72,
  },
  loadingWrap: {
    ...POSFlex('center', 'center', undefined),
    width: '100%',
    maxWidth: 1312,
    minWidth: 904,
    height: 600,
    background: '#F5F8FA',
  },
  productContainer: {
    ...POSFlex('center', 'center', 'column'),
    maxWidth: 1312,
    minWidth: 904,
    padding: '48px 120px',
    background: '#F5F8FA',
  },
  productInfoWrap: {
    ...POSFlex('center', undefined, 'row'),
    width: '100%',
  },
  productInfoBox: {
    maxWidth: 700,
    minWidth: 420,
    padding: '24px 48px',
    flex: 1,
  },
  productInfoTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
  productImageBox: {
    marginLeft: 'auto',
    flexShrink: 0,
    width: 240,
    height: 300,
  },
  productTipWrap: {
    lineHeight: 1.5,
    marginBlockStart: 48,
    textAlign: 'center',
  },
  productTipTitle: {
    ...POSFont(36, 700, 1.2, 'rgba(0,0,0.87)'),
  },
  productTipSubTitle: {
    marginBlockStart: 24,
    color: 'rgba(0,0,0,.6)',
  },
});

interface BPRatesStatusProps {
  encompassData: Encompass;
  loanInfo: RatesBPLoanInfo;
  loanStage: LoanStage;
  processId: string;
}

export const BPRatesStatus: FC<BPRatesStatusProps> = (props) => {
  const {
    processId,
    loanStage,
    loanInfo = {
      totalLoanAmount: 0,
      purchaseLoanAmount: 0,
      cor: 0,
    },
    encompassData = {
      currentLockExpires: '2022-05-12T07:50:39.897Z',
      currentNumberOfDays: '2022-05-12T07:50:39.897Z',
    },
  } = props;
  const { currentLockExpires, currentNumberOfDays } = encompassData;
  const { totalLoanAmount, purchaseLoanAmount, cor } = loanInfo;

  const classes = useStyles();
  const [rateProductData, setRateProductData] = useState<RatesProductData>();

  const { loading } = useAsync(async () => {
    if (!processId) {
      return;
    }
    return await _fetchRatesProductSelected(processId)
      .then(({ data }) => {
        setRateProductData({ ...rateProductData, ...data });
      })
      .catch((err) => console.log(err));
  }, [processId]);

  const parsedData = useMemo(() => {
    if (loading || !rateProductData) {
      return;
    }
    return {
      rate: utils.formatLocalPercent(rateProductData.interestRateOfYear),
      term: rateProductData.loanTerm,
      totalLoanAmount: utils.formatDollar(totalLoanAmount),
      cor: utils.formatDollar(cor),
      purchaseLoanAmount: utils.formatDollar(purchaseLoanAmount),
      monthlyPayment: utils.formatDollar(rateProductData.paymentOfMonth),
      tips: {
        primary:
          loanStage === LoanStage.RateLocking ? (
            "We're helping you confirm your rate"
          ) : (
            <>
              Your rate expires on{' '}
              <span style={{ color: '#3F81E9' }}>
                {
                  utils
                    .formatDate(new Date(currentLockExpires), 'MM/dd/yyyy O')
                    .split(' ')[0]
                }
              </span>
            </>
          ),
        subTip:
          loanStage === LoanStage.RateLocking ? (
            "You'll get the update once the rate is finally locked."
          ) : (
            <>
              <span style={{ color: '#3F81E9' }}>{currentNumberOfDays}</span>{' '}
              days left
            </>
          ),
      },
      image:
        loanStage === LoanStage.RateLocking
          ? '/rates_locking.png'
          : '/rates_locked.png',
    };
  }, [
    currentLockExpires,
    currentNumberOfDays,
    loading,
    cor,
    totalLoanAmount,
    loanStage,
    purchaseLoanAmount,
    rateProductData,
  ]);

  return (
    <>
      <Box className={classes.container}>
        <FormItem
          label={
            loanStage === LoanStage.RateLocking ? 'Rate locking' : 'Rate locked'
          }
          className={classes.title}
        />
        {loading ? (
          <Box className={classes.loadingWrap}>
            <CircularProgress style={{ height: 48, width: 48 }} />
          </Box>
        ) : (
          <Box className={classes.productContainer}>
            <Box className={classes.productInfoWrap}>
              <Box className={classes.productInfoBox}>
                <Box className={classes.productInfoTitle}>Your rate</Box>
                <ProductItem
                  label={'Rate'}
                  info={`${parsedData.rate}`}
                  mt={'24px'}
                />
                <ProductItem
                  label={'Loan term'}
                  info={`${parsedData.term} months`}
                  mt={'12px'}
                  mb={'12px'}
                />
                <Divider />
                <ProductItem
                  label={'Total loan amount'}
                  info={parsedData.totalLoanAmount}
                  mt={'12px'}
                />
                <ProductItem
                  label={'Purchase loan amount'}
                  info={parsedData.purchaseLoanAmount}
                  mt={'12px'}
                />
                <ProductItem
                  label={'Rehab loan amount'}
                  info={parsedData.cor}
                  mt={'12px'}
                />
                <ProductItem
                  label={'Monthly payment'}
                  info={parsedData.monthlyPayment}
                  mt={'12px'}
                />
              </Box>
              <Box className={classes.productImageBox}>
                <Image width={240} height={300} src={parsedData.image} alt="" />
              </Box>
            </Box>
            <Box className={classes.productTipWrap}>
              <Box className={classes.productTipTitle}>
                {parsedData.tips.primary}
              </Box>
              <Box className={classes.productTipSubTitle}>
                {parsedData.tips.subTip}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
