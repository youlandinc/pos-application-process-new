import React, { FC, useEffect, useState, useMemo } from 'react';
import { useNextBtnClasses } from '@/common/classes';
import { POSFlex, POSFont } from '@/common/styles/global';

import { utils } from '@/common/utils';
import { StyledButton } from '@/components/atoms';
import {
  BPLoanInfo,
  MortgagePropertyOptions,
  ProductItem,
} from '@/components/molecules';
import { RatesProductData } from '@/types/dashboardData';
import { UserType, LoanStage } from '@/types/enum';
import { Box, Button, Drawer, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  drawerWrap: {
    width: 560,
  },
  drawerHeader: {
    width: '100%',
    position: 'sticky',
    top: 0,
    background: '#ffffff',
    padding: '24px 0',
    zIndex: 1,
    borderBottom: '1px solid rgba(0,0,0,.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButtonWrapContent: {
    marginLeft: 24,
    fontSize: 24,
    lineHeight: 1.5,
  },
  closeButton: {
    width: 48,
    minWidth: 48,
    height: 48,
    border: '2px solid rgba(0,0,0,.6)',
    padding: 0,
    borderRadius: 8,
    marginRight: 24,
    '&:hover': {
      borderColor: '#3F81E9',
      background: 'transparent',
    },
  },
  closeIcon: {
    fontSize: 16,
    color: 'rgba(0,0,0,.6)',
  },
  drawerMain: {
    padding: '12px 48px 24px 48px',
    height: 'calc(100vh - 194px)',
    overflow: 'auto',
  },
  drawerInfoSummaryBox: {
    lineHeight: 1.5,
    color: 'rgba(0,0,0,.87)',
    fontWeight: 700,
  },
  drawerInfoSummaryTitle: {
    marginTop: 12,
    fontSize: 30,
    lineHeight: 1.5,
  },
  drawerInfoSummarySubtitle: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(0,0,0,.6)',
    fontWeight: 400,
  },
  drawerInfoSubInfoBox: {
    marginTop: 48,
  },
  drawerInfoSubInfoTitle: {
    color: 'rgba(0,0,0,.87)',
    fontWeight: 700,
    fontSize: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerInfoSubInfoCard: {
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.25)',
    marginTop: 12,
    borderRadius: 8,
    fontSize: 16,
    color: 'rgba(0,0,0,.87)',
    padding: 12,
    lineHeight: 1.5,
  },
  drawerInfoSubInfoCardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 12,
    '&:first-child': {
      marginTop: 0,
    },
  },
  drawerInfoSubInfoSubCard: {
    marginTop: 12,
    '&:first-child': {
      marginTop: 0,
    },
  },
  drawerInfoSubInfoSubCardItemTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
  },
  drawerInfoSubInfoSubCardItem: {
    paddingLeft: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    lineHeight: 1.5,
    marginTop: 12,
    '&:first-child': {
      marginTop: 0,
    },
  },
  drawerFooter: {
    position: 'sticky',
    background: '#ffffff',
    bottom: 0,
    padding: '24px 0',
    borderTop: '1px solid rgba(0,0,0,.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productItem: {
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.87)'),
    ...POSFlex('flex-start', 'space-between', 'row'),
    marginBlockStart: 12,
    '&:first-of-type': {
      marginBlockStart: 0,
    },
  },
});

interface BPRatesDrawerProps {
  onCancel: () => void;
  selectedItem: BPLoanInfo &
    Pick<
      RatesProductData,
      'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
    >;
  visible: boolean;
  nextStep?: (string) => void;
  userType: UserType;
  loanStage?: LoanStage;
}

export const BPRatesDrawer: FC<BPRatesDrawerProps> = (props) => {
  const {
    onCancel,
    visible,
    selectedItem,
    nextStep,
    userType,
    loanStage = LoanStage.Application,
  } = props;

  const router = useRouter();

  const classes = useStyles();
  const nextButtonClasses = useNextBtnClasses();
  const [line_1, setLine_1] = useState<string>();
  const [line_2, setLine_2] = useState<string>();
  useEffect(() => {
    if (selectedItem?.address) {
      const [LINE_1, LINE_2] = selectedItem.address.split('NEW_LINE');
      setLine_1(LINE_1);
      setLine_2(LINE_2);
    }
  }, [selectedItem?.address]);

  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <>
            <ProductItem
              className={classes.productItem}
              label={'Broker origination fee'}
              info={
                <Box fontSize={16} fontWeight={400}>
                  {utils.formatDollar(selectedItem?.brokerOriginationFee)}(
                  {utils.formatPercent(selectedItem?.brokerPoints / 100)})
                </Box>
              }
            />
            <ProductItem
              className={classes.productItem}
              label={'Broker processing fee'}
              info={
                <Box fontSize={16} fontWeight={400}>
                  {utils.formatDollar(selectedItem?.brokerProcessingFee)}
                </Box>
              }
            />
          </>
        );
      case UserType.LOAN_OFFICER:
        return (
          <>
            <ProductItem
              className={classes.productItem}
              label={'Loan officer origination fee'}
              info={
                <Box fontSize={16} fontWeight={400}>
                  {utils.formatDollar(selectedItem?.officerOriginationFee)}(
                  {utils.formatPercent(selectedItem?.officerPoints / 100)})
                </Box>
              }
            />
            <ProductItem
              className={classes.productItem}
              label={'Loan officer processing fee'}
              info={
                <Box fontSize={16} fontWeight={400}>
                  {utils.formatDollar(selectedItem?.officerProcessingFee)}
                </Box>
              }
            />
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <>
            <ProductItem
              className={classes.productItem}
              label={'Referral fee'}
              info={
                <Box fontSize={16} fontWeight={400}>
                  {utils.formatDollar(selectedItem?.agentFee)}
                </Box>
              }
            />
          </>
        );
      default:
        return null;
    }
  }, [
    classes.productItem,
    selectedItem?.agentFee,
    selectedItem?.brokerOriginationFee,
    selectedItem?.brokerPoints,
    selectedItem?.brokerProcessingFee,
    selectedItem?.officerOriginationFee,
    selectedItem?.officerPoints,
    selectedItem?.officerProcessingFee,
    userType,
  ]);

  return (
    <Drawer open={visible} anchor={'right'}>
      <Box className={classes.drawerWrap}>
        <Box className={classes.drawerHeader}>
          <Box className={classes.closeButtonWrapContent}>Rate Summary</Box>
          <Button
            component="div"
            onClick={onCancel}
            className={classes.closeButton}
          >
            <CloseIcon className={classes.closeIcon} />
          </Button>
        </Box>
        <Box className={classes.drawerMain}>
          <Box className={classes.drawerInfoSummaryBox}>
            <Box className={classes.drawerInfoSummaryTitle}>
              Get a closer look at all your costs
            </Box>
          </Box>
          <Box className={classes.drawerInfoSubInfoBox}>
            <Box className={classes.drawerInfoSubInfoTitle}>
              <Box>Purchase</Box>
            </Box>
            <Box className={classes.drawerInfoSubInfoCard}>
              <ProductItem
                className={classes.productItem}
                label={'Borrower'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {`${selectedItem?.firstName} ${selectedItem?.lastName}`}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Address'}
                info={
                  <Box
                    fontSize={16}
                    fontWeight={400}
                    width={180}
                    style={{ wordBreak: 'break-word', textAlign: 'right' }}
                  >
                    <Box>{line_1}</Box>
                    <Box>{line_2}</Box>
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Total loan amount'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.totalLoanAmount)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Purchase price'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.purchasePrice)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Purchase loan amount'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.purchaseLoanAmount)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Rehab loan amount'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.cor
                      ? utils.formatDollar(selectedItem?.cor)
                      : 'N/A'}
                  </Box>
                }
              />
            </Box>
          </Box>
          <Box className={classes.drawerInfoSubInfoBox}>
            <Box className={classes.drawerInfoSubInfoTitle}>
              <Box>Loan details</Box>
            </Box>
            <Box className={classes.drawerInfoSubInfoCard}>
              <ProductItem
                className={classes.productItem}
                label={'Amortization'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.amortization}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Property type'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.findLabel(
                      MortgagePropertyOptions['propertyOpt'],
                      selectedItem?.propertyType,
                    )}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Preferred close date'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.closeDate}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Lien'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.lien}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Estimated ARV'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.arv
                      ? utils.formatDollar(selectedItem?.arv)
                      : 'N/A'}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={`${
                  selectedItem?.isCor ? 'Loan-to-Cost' : 'Loan-to-Value (LTV)'
                }`}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatPercent(
                      selectedItem?.isCor
                        ? selectedItem?.ltc
                        : selectedItem?.ltv,
                    )}
                  </Box>
                }
              />
            </Box>
          </Box>
          <Box className={classes.drawerInfoSubInfoBox}>
            <Box className={classes.drawerInfoSubInfoTitle}>
              <Box>Rate</Box>
            </Box>
            <Box className={classes.drawerInfoSubInfoCard}>
              <ProductItem
                className={classes.productItem}
                label={'Interest rate'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatLocalPercent(selectedItem?.interestRateOfYear)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Loan term'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.loanTerm} months
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Monthly payment'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.paymentOfMonth)}
                  </Box>
                }
              />
            </Box>
          </Box>
          <Box className={classes.drawerInfoSubInfoBox}>
            <Box className={classes.drawerInfoSubInfoTitle}>
              <Box>Est. Cash required at closing</Box>
              <Box>
                {utils.formatDollar(
                  selectedItem?.totalClosingCash -
                    selectedItem?.proRatedInterest +
                    selectedItem?.paymentOfMonth / 30,
                )}
              </Box>
            </Box>
            <Box className={classes.drawerInfoSubInfoCard}>
              <ProductItem
                className={classes.productItem}
                label={'Down payment'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.downPayment)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Origination fee'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {`${utils.formatDollar(
                      selectedItem?.originationFee,
                    )}(${utils.formatPercent(
                      selectedItem?.originationFeePer || 0.015,
                    )})`}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Underwriting fee'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.underwritingFee)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Document preparation fee'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.docPreparationFee)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Pro-rated interest'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {utils.formatDollar(selectedItem?.paymentOfMonth / 30)}
                  </Box>
                }
              />
              <ProductItem
                className={classes.productItem}
                label={'Third-party costs'}
                info={
                  <Box fontSize={16} fontWeight={400}>
                    {selectedItem?.thirdPartyCosts}
                  </Box>
                }
              />
              {renderByUserType}
            </Box>
          </Box>
        </Box>
        <Box className={classes.drawerFooter}>
          {nextStep ? (
            <StyledButton
              classes={nextButtonClasses}
              style={{ width: 'calc(100% - 96px)' }}
              onClick={() => nextStep(selectedItem?.id)}
            >
              Check my pre-approval
            </StyledButton>
          ) : (
            <StyledButton
              classes={nextButtonClasses}
              style={{ width: 'calc(100% - 96px)' }}
              onClick={() => router.push('/dashboard/tasks')}
            >
              Confirm Rate
            </StyledButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
