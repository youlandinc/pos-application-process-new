//import  { FC, useEffect, useMemo, useState } from 'react';
//
//import { StyledButton } from '@/components/atoms';
//import {
//  BPLoanInfo,
//  MortgagePropertyOptions,
//  ProductItem,
//} from '@/components/molecules';
//import { RatesProductData } from '@/types/dashboardData';
//import { LoanStage, UserType } from '@/types/enum';
//import { Box, Button, Drawer, makeStyles } from '@material-ui/core';
//import CloseIcon from '@material-ui/icons/Close';
//import { useRouter } from 'next/router';
//
//const useStyles = makeStyles({
//  drawerWrap: {
//    width: 560,
//  },
//  drawerHeader: {
//    width: '100%',
//    position: 'sticky',
//    top: 0,
//    background: '#ffffff',
//    padding: '24px 0',
//    zIndex: 1,
//    borderBottom: '1px solid rgba(0,0,0,.1)',
//    display: 'flex',
//    justifyContent: 'space-between',
//    alignItems: 'center',
//  },
//  closeButtonWrapContent: {
//    marginLeft: 24,
//    fontSize: 24,
//    lineHeight: 1.5,
//  },
//  closeButton: {
//    width: 48,
//    minWidth: 48,
//    height: 48,
//    border: '2px solid rgba(0,0,0,.6)',
//    padding: 0,
//    borderRadius: 8,
//    marginRight: 24,
//    '&:hover': {
//      borderColor: '#3F81E9',
//      background: 'transparent',
//    },
//  },
//  closeIcon: {
//    fontSize: 16,
//    color: 'rgba(0,0,0,.6)',
//  },
//  drawerMain: {
//    padding: '12px 48px 24px 48px',
//    height: 'calc(100vh - 194px)',
//    overflow: 'auto',
//  },
//  drawerInfoSummaryBox: {
//    lineHeight: 1.5,
//    color: 'rgba(0,0,0,.87)',
//    fontWeight: 700,
//  },
//  drawerInfoSummaryTitle: {
//    marginTop: 12,
//    fontSize: 30,
//    lineHeight: 1.5,
//  },
//  drawerInfoSummarySubtitle: {
//    marginTop: 12,
//    fontSize: 16,
//    color: 'rgba(0,0,0,.6)',
//    fontWeight: 400,
//  },
//  drawerInfoSubInfoBox: {
//    marginTop: 48,
//  },
//  drawerInfoSubInfoTitle: {
//    color: 'rgba(0,0,0,.87)',
//    fontWeight: 700,
//    fontSize: 16,
//    display: 'flex',
//    justifyContent: 'space-between',
//    alignItems: 'center',
//  },
//  drawerInfoSubInfoCard: {
//    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.25)',
//    marginTop: 12,
//    borderRadius: 8,
//    fontSize: 16,
//    color: 'rgba(0,0,0,.87)',
//    padding: 12,
//    lineHeight: 1.5,
//  },
//  drawerInfoSubInfoCardItem: {
//    display: 'flex',
//    justifyContent: 'space-between',
//    alignItems: 'center',
//    flexShrink: 0,
//    marginTop: 12,
//    '&:first-child': {
//      marginTop: 0,
//    },
//  },
//  drawerInfoSubInfoSubCard: {
//    marginTop: 12,
//    '&:first-child': {
//      marginTop: 0,
//    },
//  },
//  drawerInfoSubInfoSubCardItemTitle: {
//    display: 'flex',
//    justifyContent: 'space-between',
//    alignItems: 'center',
//    fontWeight: 700,
//  },
//  drawerInfoSubInfoSubCardItem: {
//    paddingLeft: 12,
//    display: 'flex',
//    justifyContent: 'space-between',
//    alignItems: 'center',
//    lineHeight: 1.5,
//    marginTop: 12,
//    '&:first-child': {
//      marginTop: 0,
//    },
//  },
//  drawerFooter: {
//    position: 'sticky',
//    background: '#ffffff',
//    bottom: 0,
//    padding: '24px 0',
//    borderTop: '1px solid rgba(0,0,0,.1)',
//    display: 'flex',
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  productItem: {
//    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.87)'),
//    ...POSFlex('flex-start', 'space-between', 'row'),
//    marginBlockStart: 12,
//    '&:first-of-type': {
//      marginBlockStart: 0,
//    },
//  },
//});
//
//interface BPRatesDrawerProps {
//  onCancel: () => void;
//  selectedItem: BPLoanInfo &
//    Pick<
//      RatesProductData,
//      'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
//    >;
//  visible: boolean;
//  nextStep?: (string) => void;
//  userType: UserType;
//  loanStage?: LoanStage;
//}
//
//export const BPRatesDrawer: FC<BPRatesDrawerProps> = (props) => {
//  const {
//    onCancel,
//    visible,
//    selectedItem,
//    nextStep,
//    userType,
//    loanStage = LoanStage.Application,
//  } = props;
//
//  const router = useRouter();
//
//  const classes = useStyles();
//  const nextButtonClasses = useNextBtnClasses();
//  const [line_1, setLine_1] = useState<string>();
//  const [line_2, setLine_2] = useState<string>();
//  useEffect(() => {
//    if (selectedItem?.address) {
//      const [LINE_1, LINE_2] = selectedItem.address.split('NEW_LINE');
//      setLine_1(LINE_1);
//      setLine_2(LINE_2);
//    }
//  }, [selectedItem?.address]);
//
//  const renderByUserType = useMemo(() => {
//    switch (userType) {
//      case UserType.BROKER:
//        return (
//          <>
//            <ProductItem
//              className={classes.productItem}
//              info={
//                <Box fontSize={16} fontWeight={400}>
//                  {utils.formatDollar(selectedItem?.brokerOriginationFee)}(
//                  {utils.formatPercent(selectedItem?.brokerPoints / 100)})
//                </Box>
//              }
//              label={'Broker origination fee'}
//            />
//            <ProductItem
//              className={classes.productItem}
//              info={
//                <Box fontSize={16} fontWeight={400}>
//                  {utils.formatDollar(selectedItem?.brokerProcessingFee)}
//                </Box>
//              }
//              label={'Broker processing fee'}
//            />
//          </>
//        );
//      case UserType.LOAN_OFFICER:
//        return (
//          <>
//            <ProductItem
//              className={classes.productItem}
//              info={
//                <Box fontSize={16} fontWeight={400}>
//                  {utils.formatDollar(selectedItem?.officerOriginationFee)}(
//                  {utils.formatPercent(selectedItem?.officerPoints / 100)})
//                </Box>
//              }
//              label={'Loan officer origination fee'}
//            />
//            <ProductItem
//              className={classes.productItem}
//              info={
//                <Box fontSize={16} fontWeight={400}>
//                  {utils.formatDollar(selectedItem?.officerProcessingFee)}
//                </Box>
//              }
//              label={'Loan officer processing fee'}
//            />
//          </>
//        );
//      case UserType.REAL_ESTATE_AGENT:
//        return (
//          <>
//            <ProductItem
//              className={classes.productItem}
//              info={
//                <Box fontSize={16} fontWeight={400}>
//                  {utils.formatDollar(selectedItem?.agentFee)}
//                </Box>
//              }
//              label={'Referral fee'}
//            />
//          </>
//        );
//      default:
//        return null;
//    }
//  }, [
//    classes.productItem,
//    selectedItem?.agentFee,
//    selectedItem?.brokerOriginationFee,
//    selectedItem?.brokerPoints,
//    selectedItem?.brokerProcessingFee,
//    selectedItem?.officerOriginationFee,
//    selectedItem?.officerPoints,
//    selectedItem?.officerProcessingFee,
//    userType,
//  ]);
//
//  return (
//    <Drawer anchor={'right'} open={visible}>
//      <Box className={classes.drawerWrap}>
//        <Box className={classes.drawerHeader}>
//          <Box className={classes.closeButtonWrapContent}>Rate Summary</Box>
//          <Button
//            className={classes.closeButton}
//            component="div"
//            onClick={onCancel}
//          >
//            <CloseIcon className={classes.closeIcon} />
//          </Button>
//        </Box>
//        <Box className={classes.drawerMain}>
//          <Box className={classes.drawerInfoSummaryBox}>
//            <Box className={classes.drawerInfoSummaryTitle}>
//              Get a closer look at all your costs
//            </Box>
//          </Box>
//          <Box className={classes.drawerInfoSubInfoBox}>
//            <Box className={classes.drawerInfoSubInfoTitle}>
//              <Box>Purchase</Box>
//            </Box>
//            <Box className={classes.drawerInfoSubInfoCard}>
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {`${selectedItem?.firstName} ${selectedItem?.lastName}`}
//                  </Box>
//                }
//                label={'Borrower'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box
//                    fontSize={16}
//                    fontWeight={400}
//                    style={{ wordBreak: 'break-word', textAlign: 'right' }}
//                    width={180}
//                  >
//                    <Box>{line_1}</Box>
//                    <Box>{line_2}</Box>
//                  </Box>
//                }
//                label={'Address'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.totalLoanAmount)}
//                  </Box>
//                }
//                label={'Total loan amount'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.purchasePrice)}
//                  </Box>
//                }
//                label={'Purchase price'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.purchaseLoanAmount)}
//                  </Box>
//                }
//                label={'Purchase loan amount'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.cor
//                      ? utils.formatDollar(selectedItem?.cor)
//                      : 'N/A'}
//                  </Box>
//                }
//                label={'Rehab loan amount'}
//              />
//            </Box>
//          </Box>
//          <Box className={classes.drawerInfoSubInfoBox}>
//            <Box className={classes.drawerInfoSubInfoTitle}>
//              <Box>Loan details</Box>
//            </Box>
//            <Box className={classes.drawerInfoSubInfoCard}>
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.amortization}
//                  </Box>
//                }
//                label={'Amortization'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.findLabel(
//                      MortgagePropertyOptions.propertyOpt,
//                      selectedItem?.propertyType,
//                    )}
//                  </Box>
//                }
//                label={'Property type'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.closeDate}
//                  </Box>
//                }
//                label={'Preferred close date'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.lien}
//                  </Box>
//                }
//                label={'Lien'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.arv
//                      ? utils.formatDollar(selectedItem?.arv)
//                      : 'N/A'}
//                  </Box>
//                }
//                label={'Estimated ARV'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatPercent(
//                      selectedItem?.isCor
//                        ? selectedItem?.ltc
//                        : selectedItem?.ltv,
//                    )}
//                  </Box>
//                }
//                label={`${
//                  selectedItem?.isCor ? 'Loan-to-Cost' : 'Loan-to-Value (LTV)'
//                }`}
//              />
//            </Box>
//          </Box>
//          <Box className={classes.drawerInfoSubInfoBox}>
//            <Box className={classes.drawerInfoSubInfoTitle}>
//              <Box>Rate</Box>
//            </Box>
//            <Box className={classes.drawerInfoSubInfoCard}>
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatLocalPercent(selectedItem?.interestRateOfYear)}
//                  </Box>
//                }
//                label={'Interest rate'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.loanTerm} months
//                  </Box>
//                }
//                label={'Loan term'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.paymentOfMonth)}
//                  </Box>
//                }
//                label={'Monthly payment'}
//              />
//            </Box>
//          </Box>
//          <Box className={classes.drawerInfoSubInfoBox}>
//            <Box className={classes.drawerInfoSubInfoTitle}>
//              <Box>Est. Cash required at closing</Box>
//              <Box>
//                {utils.formatDollar(
//                  selectedItem?.totalClosingCash -
//                    selectedItem?.proRatedInterest +
//                    selectedItem?.paymentOfMonth / 30,
//                )}
//              </Box>
//            </Box>
//            <Box className={classes.drawerInfoSubInfoCard}>
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.downPayment)}
//                  </Box>
//                }
//                label={'Down payment'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {`${utils.formatDollar(
//                      selectedItem?.originationFee,
//                    )}(${utils.formatPercent(
//                      selectedItem?.originationFeePer || 0.015,
//                    )})`}
//                  </Box>
//                }
//                label={'Origination fee'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.underwritingFee)}
//                  </Box>
//                }
//                label={'Underwriting fee'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.docPreparationFee)}
//                  </Box>
//                }
//                label={'Document preparation fee'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {utils.formatDollar(selectedItem?.paymentOfMonth / 30)}
//                  </Box>
//                }
//                label={'Pro-rated interest'}
//              />
//              <ProductItem
//                className={classes.productItem}
//                info={
//                  <Box fontSize={16} fontWeight={400}>
//                    {selectedItem?.thirdPartyCosts}
//                  </Box>
//                }
//                label={'Third-party costs'}
//              />
//              {renderByUserType}
//            </Box>
//          </Box>
//        </Box>
//        <Box className={classes.drawerFooter}>
//          {nextStep ? (
//            <StyledButton
//              classes={nextButtonClasses}
//              onClick={() => nextStep(selectedItem?.id)}
//              style={{ width: 'calc(100% - 96px)' }}
//            >
//              Check my pre-approval
//            </StyledButton>
//          ) : (
//            <StyledButton
//              classes={nextButtonClasses}
//              onClick={() => router.push('/dashboard/tasks')}
//              style={{ width: 'calc(100% - 96px)' }}
//            >
//              Confirm Rate
//            </StyledButton>
//          )}
//        </Box>
//      </Box>
//    </Drawer>
//  );
//};
