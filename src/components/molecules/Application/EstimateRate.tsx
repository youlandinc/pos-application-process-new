import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useDebounceFn, useSessionStorageState } from '@/hooks';

import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
  POSNotUndefined,
} from '@/utils';
import {
  APPLICATION_FICO_SCORE,
  APPLICATION_LIQUIDITY,
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_STATE,
} from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledSelect,
  StyledSelectTextField,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { ProductList } from '@/components/molecules/Common';

import {
  HttpError,
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPurposeEnum,
  ProductItemProps,
} from '@/types';
import { _fetchProductList } from '@/requests/application';

export const EstimateRate: FC<FormNodeBaseProps> = observer(
  ({ backStep, backState }) => {
    const router = useRouter();
    const breakpoints = useBreakpoints();

    const { saasState } = useSessionStorageState('tenantConfig');
    const {
      applicationForm: { estimateRate },
      session,
    } = useMst();

    const [expanded, setExpanded] = useState<boolean | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<
      Array<ProductItemProps | any>
    >([]);
    const [limits, setLimits] = useState<
      | {
          maxLoanAmount: number;
          minLoanAmount: number;
        }
      | undefined
    >();
    const [errorList, setErrorList] = useState<Array<string | any>>([]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const payoffAmountError = useMemo(() => {
      if (estimateRate.loanPurpose === LoanPurposeEnum.refinance) {
        if (estimateRate.isPayoff) {
          if (
            (estimateRate?.payoffAmount ?? 0) >
            (estimateRate?.refinanceLoanAmount ?? 0)
          ) {
            return [
              // 'Payoff amount must be equal to or less than the refinance loan amount',
            ];
          }
        }
      }
      return [];
    }, [
      estimateRate.isPayoff,
      estimateRate.loanPurpose,
      estimateRate?.payoffAmount,
      estimateRate?.refinanceLoanAmount,
    ]);

    const fetchProductList = async () => {
      if (payoffAmountError.length > 0) {
        setLoading(false);
        setProductList([]);
        setErrorList([
          'Payoff amount must be equal to or less than the refinance loan amount',
        ]);
        return;
      }

      const postData = {
        tenantId: saasState?.tenantId,
        loanId: router.query.loanId as string,
        ...estimateRate.getPostData(),
      };

      try {
        const { data } = await _fetchProductList(postData);
        setProductList(data?.products ?? []);
        setErrorList(data?.reasons ?? []);
        setLimits(data?.limits ?? void 0);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setLoading(false);
      }
    };

    const { run } = useDebounceFn(fetchProductList, 1000);

    const totalLoanAmount = useMemo(() => {
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          return estimateRate.loanPurpose === LoanPurposeEnum.purchase
            ? estimateRate.purchaseLoanAmount
            : estimateRate.refinanceLoanAmount;
        case LoanProductCategoryEnum.fix_and_flip:
          return estimateRate.loanPurpose === LoanPurposeEnum.purchase
            ? (estimateRate?.purchaseLoanAmount ?? 0) +
                (estimateRate?.rehabCost ?? 0)
            : (estimateRate?.refinanceLoanAmount ?? 0) +
                (estimateRate?.rehabCost ?? 0);
        case LoanProductCategoryEnum.ground_up_construction:
          return estimateRate.loanPurpose === LoanPurposeEnum.purchase
            ? ((estimateRate?.purchasePrice ?? 0) +
                (estimateRate?.purchaseConstructionCosts ?? 0)) *
                (Math.floor((estimateRate?.ltc as number) * 1000000) /
                  100000000 || 0)
            : ((estimateRate?.purchasePrice ?? 0) +
                (estimateRate?.refinanceConstructionCosts ?? 0) +
                (estimateRate?.improvementsSinceAcquisition ?? 0)) *
                (Math.floor((estimateRate?.ltc as number) * 1000000) /
                  100000000 || 0);
        default:
          return 0;
      }
    }, [
      estimateRate?.improvementsSinceAcquisition,
      estimateRate.loanPurpose,
      estimateRate?.ltc,
      estimateRate.productCategory,
      estimateRate?.purchaseConstructionCosts,
      estimateRate.purchaseLoanAmount,
      estimateRate?.purchasePrice,
      estimateRate?.refinanceConstructionCosts,
      estimateRate.refinanceLoanAmount,
      estimateRate?.rehabCost,
    ]);

    const totalLoanAmountWithoutDutch = useMemo(() => {
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          return estimateRate.loanPurpose === LoanPurposeEnum.purchase
            ? estimateRate.purchaseLoanAmount
            : estimateRate.refinanceLoanAmount;
        case LoanProductCategoryEnum.fix_and_flip:
          return estimateRate.loanPurpose === LoanPurposeEnum.purchase
            ? estimateRate?.purchaseLoanAmount
            : estimateRate?.refinanceLoanAmount;
        default:
          return 0;
      }
    }, [
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.purchaseLoanAmount,
      estimateRate.refinanceLoanAmount,
    ]);

    const LTV = useMemo(() => {
      return estimateRate.loanPurpose === LoanPurposeEnum.purchase
        ? estimateRate.purchasePrice
          ? (estimateRate.purchaseLoanAmount ?? 0) / estimateRate.purchasePrice
          : 0
        : estimateRate.propertyValue
          ? (estimateRate.refinanceLoanAmount ?? 0) / estimateRate.propertyValue
          : 0;
    }, [
      estimateRate?.loanPurpose,
      estimateRate?.propertyValue,
      estimateRate?.purchaseLoanAmount,
      estimateRate?.purchasePrice,
      estimateRate?.refinanceLoanAmount,
    ]);

    const ARLTV = useMemo(() => {
      if (
        ![
          LoanProductCategoryEnum.fix_and_flip,
          LoanProductCategoryEnum.ground_up_construction,
        ].includes(estimateRate.productCategory)
      ) {
        return 0;
      }
      let dividend = 0;
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.fix_and_flip:
          dividend =
            estimateRate.loanPurpose === LoanPurposeEnum.purchase
              ? (estimateRate?.purchaseLoanAmount ?? 0) +
                (estimateRate?.rehabCost ?? 0)
              : (estimateRate?.refinanceLoanAmount ?? 0) +
                (estimateRate?.rehabCost ?? 0);
          break;
        case LoanProductCategoryEnum.ground_up_construction:
          dividend = totalLoanAmount || 0;
          break;
      }

      const divisor = estimateRate?.arv ?? 0;
      const quotient = dividend / divisor;
      return !isNaN(quotient) && isFinite(quotient) ? quotient : 0;
    }, [
      estimateRate?.arv,
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate?.purchaseLoanAmount,
      estimateRate?.refinanceLoanAmount,
      estimateRate?.rehabCost,
      totalLoanAmount,
    ]);

    const LTC = useMemo(() => {
      if (
        estimateRate.productCategory !==
        LoanProductCategoryEnum.stabilized_bridge
      ) {
        switch (estimateRate.loanPurpose) {
          case LoanPurposeEnum.purchase:
            return estimateRate?.purchasePrice
              ? ((estimateRate?.purchaseLoanAmount ?? 0) +
                  (estimateRate?.rehabCost ?? 0)) /
                  (estimateRate?.purchasePrice + (estimateRate?.rehabCost ?? 0))
              : 0;
          case LoanPurposeEnum.refinance:
            return estimateRate?.propertyValue
              ? ((estimateRate.refinanceLoanAmount ?? 0) +
                  (estimateRate?.rehabCost ?? 0)) /
                  (estimateRate.propertyValue + (estimateRate?.rehabCost ?? 0))
              : 0;
        }
      }
      return 0;
    }, [
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate?.propertyValue,
      estimateRate?.purchaseLoanAmount,
      estimateRate?.purchasePrice,
      estimateRate?.refinanceLoanAmount,
      estimateRate?.rehabCost,
    ]);

    const renderSummary = useMemo(() => {
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <Typography
                color={'text.secondary'}
                sx={{
                  '& > b': {
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
                variant={'body2'}
              >
                This property is located in{' '}
                <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
                the FlCO score is{' '}
                <b>
                  {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
                </b>
                {estimateRate.isLiquidity ? (
                  <>
                    , the liquidity is{' '}
                    <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(estimateRate.purchasePrice)}</b>. The total
                loan amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
              </Typography>
            );
          }
          return (
            <Typography
              color={'text.secondary'}
              sx={{
                '& > b': {
                  color: 'text.primary',
                  fontWeight: 600,
                },
              }}
              variant={'body2'}
            >
              This property is located in{' '}
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
              the FlCO score is{' '}
              <b>
                {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
              </b>
              {estimateRate.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The as-is property value is{' '}
              <b>{POSFormatDollar(estimateRate.propertyValue)}</b>. The total
              loan amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        case LoanProductCategoryEnum.fix_and_flip:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <Typography
                color={'text.secondary'}
                sx={{
                  '& > b': {
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
                variant={'body2'}
              >
                This property is located in{' '}
                <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
                the FlCO score is{' '}
                <b>
                  {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
                </b>
                {estimateRate.isLiquidity ? (
                  <>
                    , the liquidity is{' '}
                    <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(estimateRate.purchasePrice)}</b>. The
                estimated cost of rehab is{' '}
                <b>{POSFormatDollar(estimateRate.rehabCost)}</b>, and the
                after-repair value of the property will be{' '}
                <b>{POSFormatDollar(estimateRate.arv)}</b>. The total loan
                amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
              </Typography>
            );
          }
          return (
            <Typography
              color={'text.secondary'}
              sx={{
                '& > b': {
                  color: 'text.primary',
                  fontWeight: 600,
                },
              }}
              variant={'body2'}
            >
              This property is located in{' '}
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
              the FlCO score is{' '}
              <b>
                {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
              </b>
              {estimateRate.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The as-is property value is{' '}
              <b>{POSFormatDollar(estimateRate.propertyValue)}</b>. The
              estimated cost of rehab is{' '}
              <b>{POSFormatDollar(estimateRate.rehabCost)}</b>, and the
              after-repair value of the property will be{' '}
              <b>{POSFormatDollar(estimateRate.arv)}</b>. The total loan amount
              is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        case LoanProductCategoryEnum.ground_up_construction:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <Typography
                color={'text.secondary'}
                sx={{
                  '& > b': {
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
                variant={'body2'}
              >
                This property is located in{' '}
                <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
                with a FICO score range of{' '}
                <b>
                  {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
                </b>
                {estimateRate.isLiquidity ? (
                  <>
                    {' '}
                    and liquidity of{' '}
                    <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(estimateRate.purchasePrice)}</b>. the
                estimated cost of rehab construction is{' '}
                <b>{POSFormatDollar(estimateRate.purchaseConstructionCosts)}</b>
                , and the completed/after-repair value of the property will be{' '}
                <b>{POSFormatDollar(estimateRate.arv)}</b>, and the total loan
                amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
              </Typography>
            );
          }
          return (
            <Typography
              color={'text.secondary'}
              sx={{
                '& > b': {
                  color: 'text.primary',
                  fontWeight: 600,
                },
              }}
              variant={'body2'}
            >
              This property is located in{' '}
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, estimateRate.state)}</b>,
              the FlCO score is{' '}
              <b>
                {POSFindLabel(APPLICATION_FICO_SCORE, estimateRate.ficoScore)}
              </b>
              {estimateRate.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(estimateRate.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The purchase price is{' '}
              <b>{POSFormatDollar(estimateRate.purchasePrice)}</b>, with
              <b>
                {POSFormatDollar(estimateRate.improvementsSinceAcquisition)}
              </b>
              , in improvements made since acquisition and{' '}
              <b>{POSFormatDollar(estimateRate.refinanceConstructionCosts)}</b>
              remaining in construction costs. The estimated completed
              (after-repair) value of the property is{' '}
              <b>{POSFormatDollar(estimateRate.arv)}</b>, and the total loan
              amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        default:
          return '';
      }
    }, [
      estimateRate.arv,
      estimateRate.ficoScore,
      estimateRate.improvementsSinceAcquisition,
      estimateRate.isLiquidity,
      estimateRate.liquidityAmount,
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.propertyValue,
      estimateRate.purchaseConstructionCosts,
      estimateRate.purchasePrice,
      estimateRate.refinanceConstructionCosts,
      estimateRate.rehabCost,
      estimateRate.state,
      totalLoanAmount,
    ]);

    const renderEditFields = useMemo(() => {
      const condition = ['xs', 'sm', 'md'].includes(breakpoints);
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'stretch' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                ml={-0.5}
              >
                <StyledTextFieldNumber
                  label={'Purchase price'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('purchasePrice', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.purchasePrice}
                />

                <StyledTextFieldNumber
                  label={'Purchase loan amount'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue(
                      'purchaseLoanAmount',
                      floatValue,
                    );
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.purchaseLoanAmount}
                />
                <Typography
                  color={'text.secondary'}
                  mt={2}
                  sx={{
                    '& > b': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                  variant={'body3'}
                >
                  Loan to value: <b>{POSFormatPercent(LTV, 1)}</b>
                </Typography>
              </Stack>
            );
          }
          return (
            <Stack
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
              ml={-0.5}
            >
              <StyledTextFieldNumber
                label={'As-is property value'}
                onValueChange={({ floatValue }) => {
                  estimateRate.changeFieldValue('propertyValue', floatValue);
                }}
                prefix={'$'}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={estimateRate.propertyValue}
              />

              <StyledTextFieldNumber
                label={'Refinance loan amount'}
                onValueChange={({ floatValue }) => {
                  estimateRate.changeFieldValue(
                    'refinanceLoanAmount',
                    floatValue,
                  );
                }}
                prefix={'$'}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={estimateRate.refinanceLoanAmount}
              />

              <StyledSelectTextField
                fieldLabel={'Payoff amount'}
                fieldValue={estimateRate.payoffAmount}
                isTooltip={true}
                onFieldChange={(floatValue) =>
                  estimateRate.changeFieldValue('payoffAmount', floatValue)
                }
                onSelectChange={(value) => {
                  estimateRate.changeFieldValue(
                    'isPayoff',
                    value === LoanAnswerEnum.yes,
                  );
                }}
                selectLabel={'Payoff amount'}
                selectValue={
                  estimateRate.isPayoff ? LoanAnswerEnum.yes : LoanAnswerEnum.no
                }
                sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                tooltipTitle={
                  'The total amount needed to fully repay your existing loan. If not sure, please open the dropdown menu on the right side of the textfield and select "Not sure".'
                }
                validate={payoffAmountError}
              />

              {!condition && (
                <Typography
                  color={'text.secondary'}
                  mt={2}
                  sx={{
                    '& > b': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                  variant={'body3'}
                >
                  Loan to value: <b>{POSFormatPercent(LTV, 1)}</b>
                </Typography>
              )}
            </Stack>
          );
        case LoanProductCategoryEnum.fix_and_flip:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <>
                <Stack
                  alignItems={{ xs: 'flex-start', lg: 'stretch' }}
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  ml={-0.5}
                >
                  <StyledTextFieldNumber
                    label={'Purchase price'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue(
                        'purchasePrice',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={estimateRate.purchasePrice}
                  />

                  <StyledTextFieldNumber
                    label={'Purchase loan amount'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue(
                        'purchaseLoanAmount',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={estimateRate.purchaseLoanAmount}
                  />

                  {!condition && (
                    <Stack mt={0.5}>
                      <Typography
                        color={'text.secondary'}
                        sx={{
                          '& > b': {
                            color: 'primary.main',
                            fontWeight: 600,
                          },
                        }}
                        variant={'body3'}
                      >
                        After-repair loan to value:{' '}
                        <b>
                          {POSFormatPercent(ARLTV, POSGetDecimalPlaces(ARLTV))}
                        </b>
                      </Typography>

                      <Typography
                        color={'text.secondary'}
                        sx={{
                          '& > b': {
                            color: 'primary.main',
                            fontWeight: 600,
                          },
                        }}
                        variant={'body3'}
                      >
                        Loan to cost:{' '}
                        <b>{POSFormatPercent(LTC, POSGetDecimalPlaces(LTC))}</b>
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Stack
                  alignItems={{ xs: 'flex-start', lg: 'center' }}
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  ml={-0.5}
                >
                  <StyledTextFieldNumber
                    label={'Est. cost of rehab'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue('rehabCost', floatValue);
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={estimateRate.rehabCost}
                  />
                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'After repair value (ARV)'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue('arv', floatValue);
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={'Estimated value of the property after rehab'}
                    value={estimateRate.arv}
                  />
                </Stack>
              </>
            );
          }
          return (
            <>
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'stretch' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                ml={-0.5}
              >
                <StyledTextFieldNumber
                  label={'As-is property value'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('propertyValue', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.propertyValue}
                />

                <StyledTextFieldNumber
                  label={'Refinance loan amount'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue(
                      'refinanceLoanAmount',
                      floatValue,
                    );
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.refinanceLoanAmount}
                />

                <StyledSelectTextField
                  fieldLabel={'Payoff amount'}
                  fieldValue={estimateRate.payoffAmount}
                  isTooltip={true}
                  onFieldChange={(floatValue) =>
                    estimateRate.changeFieldValue('payoffAmount', floatValue)
                  }
                  onSelectChange={(value) => {
                    estimateRate.changeFieldValue(
                      'isPayoff',
                      value === LoanAnswerEnum.yes,
                    );
                  }}
                  selectLabel={'Payoff amount'}
                  selectValue={
                    estimateRate.isPayoff
                      ? LoanAnswerEnum.yes
                      : LoanAnswerEnum.no
                  }
                  sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    'The total amount needed to fully repay your existing loan. If not sure, please open the dropdown menu on the right side of the textfield and select "Not sure".'
                  }
                  validate={payoffAmountError}
                />

                {!['xs', 'sm', 'md'].includes(breakpoints) && (
                  <Stack mt={0.5}>
                    <Typography
                      color={'text.secondary'}
                      sx={{
                        '& > b': {
                          color: 'primary.main',
                          fontWeight: 600,
                        },
                      }}
                      variant={'body3'}
                    >
                      After-repair loan to value:{' '}
                      <b>
                        {POSFormatPercent(ARLTV, POSGetDecimalPlaces(ARLTV))}
                      </b>
                    </Typography>

                    <Typography
                      color={'text.secondary'}
                      sx={{
                        '& > b': {
                          color: 'primary.main',
                          fontWeight: 600,
                        },
                      }}
                      variant={'body3'}
                    >
                      Loan to cost:{' '}
                      <b>{POSFormatPercent(LTC, POSGetDecimalPlaces(LTC))}</b>
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'center' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                ml={-0.5}
              >
                <StyledTextFieldNumber
                  label={'Est. cost of rehab'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('rehabCost', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.rehabCost}
                />
                <StyledTextFieldNumber
                  isTooltip={true}
                  label={'After repair value (ARV)'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('arv', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={'Estimated value of the property after rehab'}
                  value={estimateRate.arv}
                />
              </Stack>
            </>
          );
        case LoanProductCategoryEnum.ground_up_construction:
          if (estimateRate.loanPurpose === LoanPurposeEnum.purchase) {
            return (
              <>
                <Stack
                  alignItems={{ xs: 'flex-start', lg: 'stretch' }}
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  ml={-0.5}
                >
                  <StyledTextFieldNumber
                    label={'Purchase price'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue(
                        'purchasePrice',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={estimateRate.purchasePrice}
                  />

                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'Est. construction costs'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue(
                        'purchaseConstructionCosts',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={
                      'The estimated costs needed to build the construction project, including materials, labor, and other expenses'
                    }
                    value={estimateRate.purchaseConstructionCosts}
                  />

                  <StyledTextFieldNumber
                    decimalScale={0}
                    isTooltip={true}
                    label={'Loan to total cost'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue('ltc', floatValue);
                    }}
                    suffix={'%'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    thousandSeparator={false}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={
                      'Your total loan amount as a % of your purchase price and estimated construction costs.'
                    }
                    value={estimateRate.ltc}
                  />
                </Stack>

                <Stack
                  alignItems={{ xs: 'flex-start', lg: 'center' }}
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  ml={-0.5}
                >
                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'Completed/After-repair value (ARV)'}
                    onValueChange={({ floatValue }) => {
                      estimateRate.changeFieldValue('arv', floatValue);
                    }}
                    prefix={'$'}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: '100%', lg: 464 },
                    }}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 464 } }}
                    tooltipTitle={
                      'Estimated value of the property after construction.'
                    }
                    value={estimateRate.arv}
                  />
                  {!condition && (
                    <Typography
                      color={'text.secondary'}
                      sx={{
                        mt: 0.5,
                        '& > b': {
                          color: 'primary.main',
                          fontWeight: 600,
                        },
                      }}
                      variant={'body3'}
                    >
                      After-repair loan to value:{' '}
                      <b>
                        {POSFormatPercent(ARLTV, POSGetDecimalPlaces(ARLTV))}
                      </b>
                    </Typography>
                  )}
                </Stack>
              </>
            );
          }
          return (
            <>
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'stretch' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                ml={-0.5}
              >
                <StyledTextFieldNumber
                  label={'Purchase price'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('purchasePrice', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.purchasePrice}
                />

                <StyledTextFieldNumber
                  isTooltip={true}
                  label={'Improvements since acquisition'}
                  onValueChange={({ floatValue }) =>
                    estimateRate.changeFieldValue(
                      'improvementsSinceAcquisition',
                      floatValue,
                    )
                  }
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    'How much has been spent towards completed work?'
                  }
                  value={estimateRate.improvementsSinceAcquisition}
                />

                <StyledTextFieldNumber
                  decimalScale={0}
                  isTooltip={true}
                  label={'Loan to total cost'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('ltc', floatValue);
                  }}
                  suffix={'%'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  thousandSeparator={false}
                  tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    'Your total loan amount as a % of your purchase price and estimated construction costs.'
                  }
                  value={estimateRate.ltc}
                />
              </Stack>

              <Stack
                alignItems={{ xs: 'flex-start', lg: 'center' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                ml={-0.5}
              >
                <StyledTextFieldNumber
                  isTooltip={true}
                  label={'Remaining construction costs'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue(
                      'refinanceConstructionCosts',
                      floatValue,
                    );
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    'The estimated costs needed to complete the current construction project'
                  }
                  value={estimateRate.refinanceConstructionCosts}
                />

                <StyledTextFieldNumber
                  isTooltip={true}
                  label={'Completed/After-repair value (ARV)'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('arv', floatValue);
                  }}
                  prefix={'$'}
                  sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', lg: 464 },
                  }}
                  tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 464 } }}
                  tooltipTitle={
                    'Estimated value of the property after construction.'
                  }
                  value={estimateRate.arv}
                />
                {!condition && (
                  <Typography
                    color={'text.secondary'}
                    sx={{
                      mt: 0.5,
                      '& > b': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    }}
                    variant={'body3'}
                  >
                    After-repair loan to value:{' '}
                    <b>{POSFormatPercent(ARLTV, POSGetDecimalPlaces(ARLTV))}</b>
                  </Typography>
                )}
              </Stack>
            </>
          );
        default:
          return <></>;
      }
    }, [ARLTV, LTC, LTV, breakpoints, estimateRate, payoffAmountError]);

    const renderTail = useMemo(() => {
      const condition = ['xs', 'sm', 'md'].includes(breakpoints);
      const futureConstructionFunding =
        estimateRate.loanPurpose === LoanPurposeEnum.purchase
          ? estimateRate.purchaseConstructionCosts
          : estimateRate.refinanceConstructionCosts;

      const initialDisbursement = Math.max(
        (totalLoanAmount ?? 0) - (futureConstructionFunding ?? 0),
        0,
      );

      const firstLine = (
        <Stack
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={{ xs: 1.5, lg: 3 }}
        >
          {estimateRate.productCategory ===
            LoanProductCategoryEnum.ground_up_construction && (
            <>
              <Typography
                color={'text.secondary'}
                sx={{ '& > span': { color: 'primary.main', fontWeight: 600 } }}
                variant={'subtitle1'}
              >
                Initial disbursement:{' '}
                <span>{POSFormatDollar(initialDisbursement)}</span>
              </Typography>
              <Typography
                color={'text.secondary'}
                sx={{ '& > span': { color: 'primary.main', fontWeight: 600 } }}
                variant={'subtitle1'}
              >
                Future construction funding:{' '}
                <span>
                  {POSFormatDollar(
                    Math.min(
                      futureConstructionFunding ?? 0,
                      totalLoanAmount ?? 0,
                    ),
                  )}
                </span>
              </Typography>
            </>
          )}

          <Typography
            color={'text.secondary'}
            sx={{ '& > span': { color: 'primary.main', fontWeight: 600 } }}
            variant={'subtitle1'}
          >
            Total loan amount: <span>{POSFormatDollar(totalLoanAmount)}</span>
          </Typography>
        </Stack>
      );

      if (!condition) {
        return firstLine;
      }

      return (
        <>
          {firstLine}
          {estimateRate.productCategory !==
            LoanProductCategoryEnum.ground_up_construction && (
            <Stack flex={1} maxWidth={240} mt={-1.5} width={'100%'}>
              {loading ? (
                <>
                  <Skeleton
                    animation={'wave'}
                    height={14}
                    variant="rounded"
                    width={'100%'}
                  />
                  <Skeleton
                    animation={'wave'}
                    height={14}
                    sx={{
                      marginTop: 1,
                    }}
                    variant="rounded"
                    width={'100%'}
                  />
                </>
              ) : (
                <>
                  <Typography color={'text.secondary'} variant={'body3'}>
                    You qualify for a loan amount between{' '}
                  </Typography>
                  <Typography
                    color={'text.secondary'}
                    sx={{
                      '& > b': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    }}
                    variant={'body3'}
                  >
                    <b>{POSFormatDollar(limits?.minLoanAmount)}</b> and{' '}
                    <b>{POSFormatDollar(limits?.maxLoanAmount)}</b>.
                  </Typography>
                </>
              )}
            </Stack>
          )}

          <Stack flex={1} mt={-1.5}>
            {estimateRate.productCategory !==
            LoanProductCategoryEnum.stabilized_bridge ? (
              <>
                <Typography
                  color={'text.secondary'}
                  sx={{
                    '& > b': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                  variant={'body3'}
                >
                  After-repair loan to value:{' '}
                  <b>{POSFormatPercent(ARLTV, 1)}</b>
                </Typography>

                {estimateRate.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction && (
                  <Typography
                    color={'text.secondary'}
                    sx={{
                      '& > b': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    }}
                    variant={'body3'}
                  >
                    Loan to cost: <b>{POSFormatPercent(LTC, 1)}</b>
                  </Typography>
                )}
              </>
            ) : (
              <Typography
                color={'text.secondary'}
                sx={{
                  '& > b': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                }}
                variant={'body3'}
              >
                Loan to value: <b>{POSFormatPercent(LTV, 1)}</b>
              </Typography>
            )}
          </Stack>
        </>
      );
    }, [
      ARLTV,
      LTC,
      LTV,
      breakpoints,
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.purchaseConstructionCosts,
      estimateRate.refinanceConstructionCosts,
      limits?.maxLoanAmount,
      limits?.minLoanAmount,
      loading,
      totalLoanAmount,
    ]);

    useEffect(
      () => {
        if (POSNotUndefined(expanded) || expanded) {
          return;
        }
        ['xs', 'sm', 'md'].includes(breakpoints) && setExpanded(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(
      () => {
        if (!saasState?.tenantId) {
          return;
        }
        setLoading(true);
        run();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        saasState?.tenantId,
        estimateRate?.state,
        estimateRate?.ficoScore,
        estimateRate?.isLiquidity,
        estimateRate?.liquidityAmount,
        estimateRate?.rehabCost,
        estimateRate?.arv,
        estimateRate?.purchasePrice,
        estimateRate?.purchaseLoanAmount,
        estimateRate?.propertyValue,
        estimateRate?.refinanceLoanAmount,
        estimateRate?.isPayoff,
        estimateRate?.payoffAmount,
        estimateRate?.citizenship,
        estimateRate?.priorExperience,
        estimateRate?.improvementsSinceAcquisition,
        estimateRate?.refinanceConstructionCosts,
        estimateRate?.purchaseConstructionCosts,
        estimateRate?.ltc,
        session,
      ],
    );

    return (
      <StyledFormItem
        label={'Estimate your rate'}
        m={'0 auto'}
        maxWidth={976}
        tip={`${POSFindLabel(
          APPLICATION_LOAN_CATEGORY,
          estimateRate.productCategory,
        )} ${POSFindLabel(
          APPLICATION_LOAN_PURPOSE,
          estimateRate.loanPurpose,
        )} | ${
          estimateRate.propertyType !== LoanPropertyTypeEnum.two_to_four_family
            ? POSFindLabel(APPLICATION_PROPERTY_TYPE, estimateRate.propertyType)
            : POSFindLabel(APPLICATION_PROPERTY_UNIT, estimateRate.propertyUnit)
        }`}
        tipSx={{
          textAlign: 'left',
          fontSize: { xs: 12, lg: 16 },
        }}
      >
        {POSNotUndefined(expanded) && !expanded && (
          <Stack
            alignItems={'center'}
            gap={3}
            justifyContent={'space-between'}
            width={'100%'}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              width={'100%'}
            >
              <Typography color={'text.secondary'}>
                Rates based on following property:
              </Typography>
              <StyledButton
                onClick={() => setExpanded(true)}
                size={'small'}
                variant={'outlined'}
              >
                Edit
              </StyledButton>
            </Stack>
            {renderSummary}
          </Stack>
        )}

        {(!POSNotUndefined(expanded) || expanded) && (
          <Stack gap={3} width={'100%'}>
            <Stack
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
              ml={-0.5}
            >
              <StyledSelect
                isTooltip={true}
                label={'Citizenship'}
                onChange={(e) => {
                  estimateRate.changeFieldValue(
                    'citizenship',
                    e.target.value as string as LoanCitizenshipEnum,
                  );
                }}
                options={OPTIONS_COMMON_CITIZEN_TYPE}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={estimateRate.citizenship}
              />
              <StyledTextFieldNumber
                isTooltip={true}
                label={
                  estimateRate.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction
                    ? '# of prior flips'
                    : '# of construction projects exited'
                }
                onValueChange={({ floatValue }) => {
                  estimateRate.changeFieldValue('priorExperience', floatValue);
                }}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                tooltipTitle={
                  estimateRate.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction
                    ? 'Number of flips completed and held rental properties'
                    : 'The number of investment properties you have built and exited over the last 5 years'
                }
                value={estimateRate.priorExperience}
              />
            </Stack>

            <Stack
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
              ml={-0.5}
            >
              <StyledSelect
                label={'State'}
                onChange={(e) => {
                  estimateRate.changeFieldValue(
                    'state',
                    e.target.value as string,
                  );
                }}
                options={OPTIONS_COMMON_STATE}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={estimateRate.state}
              />
              {estimateRate.citizenship !==
                LoanCitizenshipEnum.foreign_national && (
                <StyledSelect
                  label={'Est. FICO score'}
                  onChange={(e) => {
                    estimateRate.changeFieldValue(
                      'ficoScore',
                      e.target.value as string as LoanFicoScoreEnum,
                    );
                  }}
                  options={APPLICATION_FICO_SCORE}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.ficoScore}
                />
              )}
              <StyledSelectTextField
                fieldLabel={'Liquidity'}
                fieldValue={estimateRate.liquidityAmount}
                isTooltip={true}
                onFieldChange={(floatValue) =>
                  estimateRate.changeFieldValue('liquidityAmount', floatValue)
                }
                onSelectChange={(value) => {
                  estimateRate.changeFieldValue(
                    'isLiquidity',
                    value === LoanAnswerEnum.yes,
                  );
                }}
                options={APPLICATION_LIQUIDITY}
                selectLabel={'Liquidity'}
                selectValue={
                  estimateRate.isLiquidity
                    ? LoanAnswerEnum.yes
                    : LoanAnswerEnum.no
                }
                sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                tooltipTitle={
                  'Liquidity means the cash or readily available funds you have, like savings or liquid investments. If unsure, use the dropdown menu on the right and select "Not sure".'
                }
              />

              {!['xs', 'sm', 'md'].includes(breakpoints) &&
                estimateRate.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction && (
                  <>
                    <Stack flex={1} maxWidth={240} mt={0.5}>
                      {loading ? (
                        <>
                          <Skeleton
                            animation={'wave'}
                            height={14}
                            variant="rounded"
                          />
                          <Skeleton
                            animation={'wave'}
                            height={14}
                            sx={{ marginTop: 1 }}
                            variant="rounded"
                          />
                        </>
                      ) : (
                        <>
                          <Typography
                            color={'text.secondary'}
                            variant={'body3'}
                          >
                            You qualify for a loan amount between{' '}
                          </Typography>
                          <Typography
                            color={'text.secondary'}
                            sx={{
                              '& > b': {
                                color: 'primary.main',
                                fontWeight: 600,
                              },
                            }}
                            variant={'body3'}
                          >
                            <b>{POSFormatDollar(limits?.minLoanAmount)}</b> and{' '}
                            <b>{POSFormatDollar(limits?.maxLoanAmount)}</b>.
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </>
                )}
            </Stack>

            {renderEditFields}

            {renderTail}
          </Stack>
        )}

        {['xs', 'sm', 'md'].includes(breakpoints) && (
          <StyledButton
            onClick={() => {
              if (!wrapperRef.current) {
                return;
              }
              const { top } = wrapperRef.current.getBoundingClientRect();
              window.scrollTo({ top: top + 24, behavior: 'smooth' });
            }}
            sx={{ maxWidth: 600, width: '100%', mt: 3 }}
            variant={'outlined'}
          >
            See rates
          </StyledButton>
        )}

        <Stack ref={wrapperRef} width={'100%'}>
          <ProductList
            errorList={errorList}
            loading={loading}
            productList={productList}
            totalLoanAmount={totalLoanAmount}
            totalLoanAmountWithoutDutch={totalLoanAmountWithoutDutch}
          />
        </Stack>

        <Stack alignItems={'center'} mt={{ xs: 6, lg: 8 }} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: '100%', maxWidth: 600 }}
            variant={'text'}
          >
            Back
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
