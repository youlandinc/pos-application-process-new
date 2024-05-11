import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { ArrowForwardIosOutlined, Close } from '@mui/icons-material';
import { useBreakpoints, useSwitch } from '@/hooks';
import { StyledButton, StyledDrawer } from '@/components/atoms';
import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
} from '@/utils';
import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
} from '@/constants';

interface OverviewLoanDetailsProps {
  productCategory: LoanProductCategoryEnum;
  loanPurpose: LoanPurposeEnum;
  //
  totalLoanAmount?: number;
  purchasePrice?: number;
  purchaseLoanAmount?: number;
  ltv?: number;
  propertyValue?: number;
  refinanceLoanAmount?: number;
  payoffAmount?: number;
  ltc?: number;
  arltv?: number;
  rehabCost?: number;
  //
  interestRate?: number;
  loanTerm?: number;
  //
  monthlyPayment?: number;
  //
  closingCash?: number;
  lenderOriginationFee?: number;
  lenderOriginationPoints?: number;
  documentPreparationFee?: number;
  thirdPartyCosts?: string;
  underwritingFee?: number;
  // proRatedInterest?: number;
  //
  compensationFee?: number;
  originationFee?: number;
  originationPoints?: number;
  processingFee?: number;
  //
  propertyType: LoanPropertyTypeEnum;
  propertyUnit?: LoanPropertyUnitEnum;
  occupancy: string;
  prepaymentPenalty: string;
  lien: string;
}

export const OverviewLoanDetails: FC<OverviewLoanDetailsProps> = ({
  productCategory,
  loanPurpose,
  //
  totalLoanAmount,
  purchasePrice,
  purchaseLoanAmount,
  ltv,
  propertyValue,
  refinanceLoanAmount,
  payoffAmount,
  ltc,
  arltv,
  rehabCost,
  //
  interestRate,
  loanTerm,
  //
  monthlyPayment,
  //
  closingCash,
  lenderOriginationFee,
  lenderOriginationPoints,
  documentPreparationFee,
  thirdPartyCosts,
  underwritingFee,
  // proRatedInterest,
  //
  compensationFee,
  originationFee,
  originationPoints,
  processingFee,
  //
  propertyType,
  propertyUnit,
  occupancy,
  prepaymentPenalty,
  lien,
}) => {
  const breakpoints = useBreakpoints();
  const { open, visible, close } = useSwitch();

  const renderLoanAmount = useMemo(() => {
    switch (productCategory) {
      case LoanProductCategoryEnum.stabilized_bridge:
        return loanPurpose === LoanPurposeEnum.purchase ? (
          <>
            <LoanDetailsCardRow
              content={POSFormatDollar(purchasePrice)}
              title={'Purchase price'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(purchaseLoanAmount)}
              title={'Purchase loan amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(ltv, POSGetDecimalPlaces(ltv))}
              title={'Loan to value'}
            />
          </>
        ) : (
          <>
            <LoanDetailsCardRow
              content={POSFormatDollar(propertyValue)}
              title={'As-is property value'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(refinanceLoanAmount)}
              title={'Refinance loan amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(payoffAmount)}
              title={'Payoff amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(ltc, POSGetDecimalPlaces(ltc))}
              title={'Loan to value'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(arltv, POSGetDecimalPlaces(arltv))}
              title={'After-repair loan to value'}
            />
          </>
        );
      case LoanProductCategoryEnum.fix_and_flip:
        return loanPurpose === LoanPurposeEnum.purchase ? (
          <>
            <LoanDetailsCardRow
              content={POSFormatDollar(purchasePrice)}
              title={'Purchase price'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(purchaseLoanAmount)}
              title={'Purchase loan amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(rehabCost)}
              title={'Est. cost of rehab'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(ltv, POSGetDecimalPlaces(ltv))}
              title={'Loan to value'}
            />
          </>
        ) : (
          <>
            <LoanDetailsCardRow
              content={POSFormatDollar(propertyValue)}
              title={'As-is property value'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(refinanceLoanAmount)}
              title={'Refinance loan amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(payoffAmount)}
              title={'Payoff amount'}
            />
            <LoanDetailsCardRow
              content={POSFormatDollar(rehabCost)}
              title={'Est. cost of rehab'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(ltc, POSGetDecimalPlaces(ltc))}
              title={'Loan to value'}
            />
            <LoanDetailsCardRow
              content={POSFormatPercent(arltv, POSGetDecimalPlaces(arltv))}
              title={'After-repair loan to value'}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    arltv,
    loanPurpose,
    ltc,
    ltv,
    payoffAmount,
    productCategory,
    propertyValue,
    purchaseLoanAmount,
    purchasePrice,
    refinanceLoanAmount,
    rehabCost,
  ]);

  return (
    <Stack
      alignItems={'center'}
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      flexDirection={'row'}
      justifyContent={'space-between'}
      onClick={open}
      p={3}
      sx={{ cursor: 'pointer' }}
      width={'100%'}
    >
      <Typography
        color={'text.primary'}
        variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h6'}
      >
        View loan details
      </Typography>

      <ArrowForwardIosOutlined />

      <StyledDrawer
        anchor={'right'}
        content={
          <Stack gap={3} p={3}>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanDetailsCardRow
                content={POSFormatDollar(totalLoanAmount)}
                isHeader={true}
                title={'Total loan amount'}
              />

              {renderLoanAmount}
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanDetailsCardRow
                content={POSFormatPercent(
                  interestRate,
                  POSGetDecimalPlaces(interestRate),
                )}
                isHeader={true}
                title={'Interest rate'}
              />

              <LoanDetailsCardRow
                content={`${loanTerm} months`}
                title={'Term'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanDetailsCardRow
                content={POSFormatDollar(monthlyPayment)}
                isHeader={true}
                title={'Monthly payment'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanDetailsCardRow
                content={POSFormatDollar(closingCash)}
                isHeader={true}
                title={'Cash required at closing'}
              />

              <LoanDetailsCardRow
                content={`${POSFormatDollar(
                  lenderOriginationFee,
                )} (${POSFormatPercent(
                  lenderOriginationPoints,
                  POSGetDecimalPlaces(lenderOriginationPoints),
                )})`}
                title={'Lender origination fee'}
              />
              <LoanDetailsCardRow
                content={POSFormatDollar(documentPreparationFee)}
                title={'Document preparation fee'}
              />
              <LoanDetailsCardRow
                content={thirdPartyCosts ?? '-'}
                title={'Third-party costs'}
              />
              <LoanDetailsCardRow
                content={POSFormatDollar(underwritingFee)}
                title={'Underwriting fee'}
              />
              {/*<LoanSummaryCardRow*/}
              {/*  content={proRatedInterest}*/}
              {/*  title={'Pro-rated interest'}*/}
              {/*/>*/}
            </Stack>

            {compensationFee && (
              <Stack
                border={'1px solid #D2D6E1'}
                borderRadius={2}
                gap={{ xs: 1.5, lg: 3 }}
                p={{ xs: 1.5, lg: 3 }}
                width={'100%'}
              >
                <LoanDetailsCardRow
                  content={POSFormatDollar(compensationFee)}
                  isHeader={true}
                  title={'Total broker compensation'}
                />
                <LoanDetailsCardRow
                  content={`${POSFormatDollar(
                    originationFee,
                  )} (${POSFormatPercent(
                    originationPoints,
                    POSGetDecimalPlaces(originationPoints),
                  )})`}
                  title={'Broker origination fee'}
                />
                <LoanDetailsCardRow
                  content={POSFormatDollar(processingFee)}
                  title={'Broker processing fee'}
                />
              </Stack>
            )}

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanDetailsCardRow
                content={' '}
                isHeader={true}
                title={'Additional details'}
              />
              <LoanDetailsCardRow
                content={prepaymentPenalty || 'None'}
                title={'Prepayment penalty'}
              />
              <LoanDetailsCardRow content={lien || '1st'} title={'Lien'} />
              <LoanDetailsCardRow
                content={POSFindLabel(
                  APPLICATION_LOAN_CATEGORY,
                  productCategory,
                )}
                title={'Loan type'}
              />
              <LoanDetailsCardRow
                content={POSFindLabel(APPLICATION_LOAN_PURPOSE, loanPurpose)}
                title={'Purpose'}
              />
              {/*todo*/}
              <LoanDetailsCardRow
                content={
                  propertyType === LoanPropertyTypeEnum.two_to_four_family
                    ? POSFindLabel(
                        APPLICATION_PROPERTY_UNIT,
                        propertyUnit ?? '',
                      )
                    : POSFindLabel(APPLICATION_PROPERTY_TYPE, propertyType)
                }
                title={'Property type'}
              />
              <LoanDetailsCardRow content={occupancy} title={'Occupancy'} />
            </Stack>
          </Stack>
        }
        footer={
          <Stack px={{ xs: 1.5, lg: 0 }} width={'100%'}>
            <StyledButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
            >
              Back
            </StyledButton>
          </Stack>
        }
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={{ xs: 1.5, lg: 0 }}
          >
            <Typography fontSize={{ xs: 20, lg: 24 }} variant={'h5'}>
              Loan details
            </Typography>
            <Close
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        }
        maxWidth={560}
        minWidth={327}
        open={visible}
      />
    </Stack>
  );
};

const LoanDetailsCardRow: FC<{
  title: string;
  content: string;
  isHeader?: boolean;
}> = ({ title, content, isHeader = false }) => {
  const breakpoints = useBreakpoints();
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'100%'}
    >
      <Typography
        color={isHeader ? 'text.primary' : 'text.secondary'}
        variant={
          isHeader
            ? ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'subtitle2'
              : 'h7'
            : ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'body3'
              : 'body1'
        }
      >
        {title}
      </Typography>
      <Typography
        color={isHeader ? 'text.primary' : 'text.primary'}
        fontWeight={600}
        variant={
          isHeader
            ? ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'subtitle2'
              : 'h7'
            : ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'body3'
              : 'body1'
        }
      >
        {content || '-'}
      </Typography>
    </Stack>
  );
};
