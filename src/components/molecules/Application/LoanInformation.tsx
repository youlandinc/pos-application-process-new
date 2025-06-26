import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useSessionStorageState } from '@/hooks';
import {
  POSFindHashKey,
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
  MULTIFAMILY_HASH,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_STATE,
} from '@/constants';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledSelect,
  StyledSelectTextField,
  StyledTextFieldNumber,
  StyledTooltip,
} from '@/components/atoms';

import {
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  PrepaymentPenaltyEnum,
} from '@/types';
import { isDate, isValid } from 'date-fns';

export const LoanInformation: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
    const breakpoints = useBreakpoints();
    const { saasState } = useSessionStorageState('tenantConfig');

    const {
      applicationForm: { loanInformation },
    } = useMst();

    const [expanded, setExpanded] = useState<boolean | undefined>();

    const [prepaymentField, setPrepaymentField] = useState<string>('');
    const [prepaymentSelect, setPrepaymentSelect] = useState<string>('');
    const isInitializedRef = useRef(false);

    // Memoize the options to prevent unnecessary recalculations
    const prepaymentPenaltyOptions = useMemo(() => {
      return saasState?.losSettings?.prepaymentPenaltyOptions?.reduce(
        (acc: Option[], cur: { key: string; label: string }) => {
          if (cur) {
            acc.push({
              label: `${cur.key} ${cur.label}`,
              key: `${cur.key} ${cur.label}`,
              value: `${cur.key} ${cur.label}`,
            });
          }
          return acc;
        },
        [
          {
            label: 'Enter prepayment penalty',
            key: 'enter_prepayment_penalty',
            value: LoanAnswerEnum.yes,
          },
        ],
      );
    }, [saasState?.losSettings?.prepaymentPenaltyOptions]);

    // Initialize the prepayment values when the component mounts or loanInformation.prepaymentPenalty changes
    useEffect(() => {
      // Skip if already initialized or no prepayment penalty
      if (
        isInitializedRef.current ||
        !loanInformation.prepaymentPenalty ||
        !prepaymentPenaltyOptions?.length
      ) {
        return;
      }

      const matchingOption = prepaymentPenaltyOptions.find(
        (item: any) => loanInformation.prepaymentPenalty === item.label,
      );

      // Set initial values
      if (matchingOption) {
        setPrepaymentSelect(matchingOption.value);
        setPrepaymentField('');
      } else {
        setPrepaymentSelect(LoanAnswerEnum.yes);
        setPrepaymentField(loanInformation.prepaymentPenalty);
      }

      isInitializedRef.current = true;
    }, [loanInformation.prepaymentPenalty, prepaymentPenaltyOptions]);

    // Update the form field when prepaymentSelect or prepaymentField changes
    useEffect(() => {
      // Skip initial render
      if (!isInitializedRef.current) {
        return;
      }

      const newValue =
        prepaymentSelect === LoanAnswerEnum.yes
          ? prepaymentField
          : prepaymentSelect;
      if (loanInformation.prepaymentPenalty !== newValue) {
        loanInformation.changeFieldValue('prepaymentPenalty', newValue);
      }
    }, [prepaymentSelect, prepaymentField, loanInformation]);

    const payoffAmountError = useMemo(() => {
      if (loanInformation.loanPurpose === LoanPurposeEnum.refinance) {
        if (loanInformation.isPayoff) {
          if (
            (loanInformation?.payoffAmount ?? 0) >
            (loanInformation?.refinanceLoanAmount ?? 0)
          ) {
            return [
              // 'Payoff amount must be equal to or less than the refinance loan amount',
            ];
          }
        }
      }
      return [];
    }, [
      loanInformation.isPayoff,
      loanInformation.loanPurpose,
      loanInformation?.payoffAmount,
      loanInformation?.refinanceLoanAmount,
    ]);

    const renderTip = useMemo(() => {
      const before = `${POSFindLabel(
        APPLICATION_LOAN_CATEGORY,
        loanInformation.productCategory,
      )} ${POSFindLabel(APPLICATION_LOAN_PURPOSE, loanInformation.loanPurpose)}`;
      switch (loanInformation.propertyType) {
        case LoanPropertyTypeEnum.two_to_four_family:
          return `${before} | ${POSFindLabel(
            APPLICATION_PROPERTY_UNIT,
            loanInformation.propertyUnit,
          )}`;
        case LoanPropertyTypeEnum.multifamily:
          return `${before} | Multifamily (${loanInformation.propertyUnit === LoanPropertyUnitEnum.twenty_plus_units ? '20+' : POSFindHashKey(loanInformation.propertyUnit, MULTIFAMILY_HASH)} Units)`;
        default:
          return `${before} | ${POSFindLabel(
            APPLICATION_PROPERTY_TYPE,
            loanInformation.propertyType,
          )}`;
      }
    }, [
      loanInformation.loanPurpose,
      loanInformation.productCategory,
      loanInformation.propertyType,
      loanInformation.propertyUnit,
    ]);

    const totalLoanAmount = useMemo(() => {
      switch (loanInformation.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
        case LoanProductCategoryEnum.dscr_rental:
          return loanInformation.loanPurpose === LoanPurposeEnum.purchase
            ? loanInformation.purchaseLoanAmount
            : loanInformation.refinanceLoanAmount;
        case LoanProductCategoryEnum.fix_and_flip:
          return loanInformation.loanPurpose === LoanPurposeEnum.purchase
            ? (loanInformation?.purchaseLoanAmount ?? 0) +
                (loanInformation?.rehabCost ?? 0)
            : (loanInformation?.refinanceLoanAmount ?? 0) +
                (loanInformation?.rehabCost ?? 0);
        case LoanProductCategoryEnum.ground_up_construction:
          return loanInformation.loanPurpose === LoanPurposeEnum.purchase
            ? ((loanInformation?.purchasePrice ?? 0) +
                (loanInformation?.purchaseConstructionCosts ?? 0)) *
                (Math.floor((loanInformation?.ltc as number) * 1000000) /
                  100000000 || 0)
            : ((loanInformation?.purchasePrice ?? 0) +
                (loanInformation?.refinanceConstructionCosts ?? 0) +
                (loanInformation?.improvementsSinceAcquisition ?? 0)) *
                (Math.floor((loanInformation?.ltc as number) * 1000000) /
                  100000000 || 0);
        default:
          return 0;
      }
    }, [
      loanInformation?.improvementsSinceAcquisition,
      loanInformation.loanPurpose,
      loanInformation?.ltc,
      loanInformation.productCategory,
      loanInformation?.purchaseConstructionCosts,
      loanInformation.purchaseLoanAmount,
      loanInformation?.purchasePrice,
      loanInformation?.refinanceConstructionCosts,
      loanInformation.refinanceLoanAmount,
      loanInformation?.rehabCost,
    ]);

    const LTV = useMemo(() => {
      return loanInformation.loanPurpose === LoanPurposeEnum.purchase
        ? loanInformation.purchasePrice
          ? (loanInformation.purchaseLoanAmount ?? 0) /
            loanInformation.purchasePrice
          : 0
        : loanInformation.propertyValue
          ? (loanInformation.refinanceLoanAmount ?? 0) /
            loanInformation.propertyValue
          : 0;
    }, [
      loanInformation?.loanPurpose,
      loanInformation?.propertyValue,
      loanInformation?.purchaseLoanAmount,
      loanInformation?.purchasePrice,
      loanInformation?.refinanceLoanAmount,
    ]);

    const ARLTV = useMemo(() => {
      if (
        ![
          LoanProductCategoryEnum.fix_and_flip,
          LoanProductCategoryEnum.ground_up_construction,
        ].includes(loanInformation.productCategory)
      ) {
        return 0;
      }
      let dividend = 0;
      switch (loanInformation.productCategory) {
        case LoanProductCategoryEnum.fix_and_flip:
          dividend =
            loanInformation.loanPurpose === LoanPurposeEnum.purchase
              ? (loanInformation?.purchaseLoanAmount ?? 0) +
                (loanInformation?.rehabCost ?? 0)
              : (loanInformation?.refinanceLoanAmount ?? 0) +
                (loanInformation?.rehabCost ?? 0);
          break;
        case LoanProductCategoryEnum.ground_up_construction:
          dividend = totalLoanAmount || 0;
          break;
      }

      const divisor = loanInformation?.arv ?? 0;
      const quotient = dividend / divisor;
      return !isNaN(quotient) && isFinite(quotient) ? quotient : 0;
    }, [
      loanInformation?.arv,
      loanInformation.loanPurpose,
      loanInformation.productCategory,
      loanInformation?.purchaseLoanAmount,
      loanInformation?.refinanceLoanAmount,
      loanInformation?.rehabCost,
      totalLoanAmount,
    ]);

    const LTC = useMemo(() => {
      if (
        loanInformation.productCategory !==
        LoanProductCategoryEnum.stabilized_bridge
      ) {
        switch (loanInformation.loanPurpose) {
          case LoanPurposeEnum.purchase:
            return loanInformation?.purchasePrice
              ? ((loanInformation?.purchaseLoanAmount ?? 0) +
                  (loanInformation?.rehabCost ?? 0)) /
                  (loanInformation?.purchasePrice +
                    (loanInformation?.rehabCost ?? 0))
              : 0;
          case LoanPurposeEnum.refinance:
            return loanInformation?.propertyValue
              ? ((loanInformation.refinanceLoanAmount ?? 0) +
                  (loanInformation?.rehabCost ?? 0)) /
                  (loanInformation.propertyValue +
                    (loanInformation?.rehabCost ?? 0))
              : 0;
        }
      }
      return 0;
    }, [
      loanInformation.loanPurpose,
      loanInformation.productCategory,
      loanInformation?.propertyValue,
      loanInformation?.purchaseLoanAmount,
      loanInformation?.purchasePrice,
      loanInformation?.refinanceLoanAmount,
      loanInformation?.rehabCost,
    ]);

    const renderSummary = useMemo(() => {
      switch (loanInformation.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                <b>
                  {POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}
                </b>
                , the FlCO score is{' '}
                <b>
                  {POSFindLabel(
                    APPLICATION_FICO_SCORE,
                    loanInformation.ficoScore,
                  )}
                </b>
                {loanInformation.isLiquidity ? (
                  <>
                    , the liquidity is{' '}
                    <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>. The
                total loan amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
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
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}</b>
              , the FlCO score is{' '}
              <b>
                {POSFindLabel(
                  APPLICATION_FICO_SCORE,
                  loanInformation.ficoScore,
                )}
              </b>
              {loanInformation.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The as-is property value is{' '}
              <b>{POSFormatDollar(loanInformation.propertyValue)}</b>. The total
              loan amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        case LoanProductCategoryEnum.fix_and_flip:
          if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                <b>
                  {POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}
                </b>
                , the FlCO score is{' '}
                <b>
                  {POSFindLabel(
                    APPLICATION_FICO_SCORE,
                    loanInformation.ficoScore,
                  )}
                </b>
                {loanInformation.isLiquidity ? (
                  <>
                    , the liquidity is{' '}
                    <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>. The
                estimated cost of rehab is{' '}
                <b>{POSFormatDollar(loanInformation.rehabCost)}</b>, and the
                after-repair value of the property will be{' '}
                <b>{POSFormatDollar(loanInformation.arv)}</b>. The total loan
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
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}</b>
              , the FlCO score is{' '}
              <b>
                {POSFindLabel(
                  APPLICATION_FICO_SCORE,
                  loanInformation.ficoScore,
                )}
              </b>
              {loanInformation.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The as-is property value is{' '}
              <b>{POSFormatDollar(loanInformation.propertyValue)}</b>. The
              estimated cost of rehab is{' '}
              <b>{POSFormatDollar(loanInformation.rehabCost)}</b>, and the
              after-repair value of the property will be{' '}
              <b>{POSFormatDollar(loanInformation.arv)}</b>. The total loan
              amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        case LoanProductCategoryEnum.ground_up_construction:
          if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                <b>
                  {POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}
                </b>
                , with a FICO score range of{' '}
                <b>
                  {POSFindLabel(
                    APPLICATION_FICO_SCORE,
                    loanInformation.ficoScore,
                  )}
                </b>
                {loanInformation.isLiquidity ? (
                  <>
                    {' '}
                    and liquidity of{' '}
                    <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>. the
                estimated cost of rehab construction is{' '}
                <b>
                  {POSFormatDollar(loanInformation.purchaseConstructionCosts)}
                </b>
                , and the completed/after-repair value of the property will be{' '}
                <b>{POSFormatDollar(loanInformation.arv)}</b>, and the total
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
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}</b>
              , the FlCO score is{' '}
              <b>
                {POSFindLabel(
                  APPLICATION_FICO_SCORE,
                  loanInformation.ficoScore,
                )}
              </b>
              {loanInformation.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The purchase price is{' '}
              <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>, with
              <b>
                {POSFormatDollar(loanInformation.improvementsSinceAcquisition)}
              </b>
              , in improvements made since acquisition and{' '}
              <b>
                {POSFormatDollar(loanInformation.refinanceConstructionCosts)}
              </b>
              remaining in construction costs. The estimated completed
              (after-repair) value of the property is{' '}
              <b>{POSFormatDollar(loanInformation.arv)}</b>, and the total loan
              amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        case LoanProductCategoryEnum.dscr_rental:
          if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                <b>
                  {POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}
                </b>
                , with a FICO score range of{' '}
                <b>
                  {POSFindLabel(
                    APPLICATION_FICO_SCORE,
                    loanInformation.ficoScore,
                  )}
                </b>
                {loanInformation.isLiquidity ? (
                  <>
                    {' '}
                    and liquidity of{' '}
                    <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                  </>
                ) : (
                  ''
                )}
                . The purchase price is{' '}
                <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>. the
                estimated cost of rehab construction is{' '}
                <b>
                  {POSFormatDollar(loanInformation.purchaseConstructionCosts)}
                </b>
                , and the completed/after-repair value of the property will be{' '}
                <b>{POSFormatDollar(loanInformation.arv)}</b>, and the total
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
              <b>{POSFindLabel(OPTIONS_COMMON_STATE, loanInformation.state)}</b>
              , the FlCO score is{' '}
              <b>
                {POSFindLabel(
                  APPLICATION_FICO_SCORE,
                  loanInformation.ficoScore,
                )}
              </b>
              {loanInformation.isLiquidity ? (
                <>
                  , the liquidity is{' '}
                  <b>{POSFormatDollar(loanInformation.liquidityAmount)}</b>
                </>
              ) : (
                ''
              )}
              . The purchase price is{' '}
              <b>{POSFormatDollar(loanInformation.purchasePrice)}</b>, with
              <b>
                {POSFormatDollar(loanInformation.improvementsSinceAcquisition)}
              </b>
              , in improvements made since acquisition and{' '}
              <b>
                {POSFormatDollar(loanInformation.refinanceConstructionCosts)}
              </b>
              remaining in construction costs. The estimated completed
              (after-repair) value of the property is{' '}
              <b>{POSFormatDollar(loanInformation.arv)}</b>, and the total loan
              amount is <b>{POSFormatDollar(totalLoanAmount)}</b>.
            </Typography>
          );
        default:
          return '';
      }
    }, [
      loanInformation.arv,
      loanInformation.ficoScore,
      loanInformation.improvementsSinceAcquisition,
      loanInformation.isLiquidity,
      loanInformation.liquidityAmount,
      loanInformation.loanPurpose,
      loanInformation.productCategory,
      loanInformation.propertyValue,
      loanInformation.purchaseConstructionCosts,
      loanInformation.purchasePrice,
      loanInformation.refinanceConstructionCosts,
      loanInformation.rehabCost,
      loanInformation.state,
      totalLoanAmount,
    ]);

    const renderEditFields = useMemo(
      () => {
        const condition = ['xs', 'sm', 'md'].includes(breakpoints);
        switch (loanInformation.productCategory) {
          case LoanProductCategoryEnum.stabilized_bridge:
            if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                      loanInformation.changeFieldValue(
                        'purchasePrice',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.purchasePrice}
                  />

                  <StyledTextFieldNumber
                    label={'Purchase loan amount'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue(
                        'purchaseLoanAmount',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.purchaseLoanAmount}
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
                    loanInformation.changeFieldValue(
                      'propertyValue',
                      floatValue,
                    );
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={loanInformation.propertyValue}
                />

                <StyledTextFieldNumber
                  label={'Refinance loan amount'}
                  onValueChange={({ floatValue }) => {
                    loanInformation.changeFieldValue(
                      'refinanceLoanAmount',
                      floatValue,
                    );
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={loanInformation.refinanceLoanAmount}
                />

                <StyledSelectTextField
                  fieldLabel={'Payoff amount'}
                  fieldValue={loanInformation.payoffAmount}
                  isTooltip={true}
                  onFieldChange={(floatValue) =>
                    loanInformation.changeFieldValue('payoffAmount', floatValue)
                  }
                  onSelectChange={(value) => {
                    loanInformation.changeFieldValue(
                      'isPayoff',
                      value === LoanAnswerEnum.yes,
                    );
                  }}
                  selectLabel={'Payoff amount'}
                  selectValue={
                    loanInformation.isPayoff
                      ? LoanAnswerEnum.yes
                      : LoanAnswerEnum.no
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
            if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                        loanInformation.changeFieldValue(
                          'purchasePrice',
                          floatValue,
                        );
                      }}
                      prefix={'$'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      value={loanInformation.purchasePrice}
                    />

                    <StyledTextFieldNumber
                      label={'Purchase loan amount'}
                      onValueChange={({ floatValue }) => {
                        loanInformation.changeFieldValue(
                          'purchaseLoanAmount',
                          floatValue,
                        );
                      }}
                      prefix={'$'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      value={loanInformation.purchaseLoanAmount}
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
                            {POSFormatPercent(
                              ARLTV,
                              POSGetDecimalPlaces(ARLTV),
                            )}
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
                          <b>
                            {POSFormatPercent(LTC, POSGetDecimalPlaces(LTC))}
                          </b>
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
                        loanInformation.changeFieldValue(
                          'rehabCost',
                          floatValue,
                        );
                      }}
                      prefix={'$'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      value={loanInformation.rehabCost}
                    />
                    <StyledTextFieldNumber
                      isTooltip={true}
                      label={'After repair value (ARV)'}
                      onValueChange={({ floatValue }) => {
                        loanInformation.changeFieldValue('arv', floatValue);
                      }}
                      prefix={'$'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      tooltipTitle={
                        'Estimated value of the property after rehab'
                      }
                      value={loanInformation.arv}
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
                      loanInformation.changeFieldValue(
                        'propertyValue',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.propertyValue}
                  />

                  <StyledTextFieldNumber
                    label={'Refinance loan amount'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue(
                        'refinanceLoanAmount',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.refinanceLoanAmount}
                  />

                  <StyledSelectTextField
                    fieldLabel={'Payoff amount'}
                    fieldValue={loanInformation.payoffAmount}
                    isTooltip={true}
                    onFieldChange={(floatValue) =>
                      loanInformation.changeFieldValue(
                        'payoffAmount',
                        floatValue,
                      )
                    }
                    onSelectChange={(value) => {
                      loanInformation.changeFieldValue(
                        'isPayoff',
                        value === LoanAnswerEnum.yes,
                      );
                    }}
                    selectLabel={'Payoff amount'}
                    selectValue={
                      loanInformation.isPayoff
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
                      loanInformation.changeFieldValue('rehabCost', floatValue);
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.rehabCost}
                  />
                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'After repair value (ARV)'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue('arv', floatValue);
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={'Estimated value of the property after rehab'}
                    value={loanInformation.arv}
                  />
                </Stack>
              </>
            );
          case LoanProductCategoryEnum.ground_up_construction:
            if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                        loanInformation.changeFieldValue(
                          'purchasePrice',
                          floatValue,
                        );
                      }}
                      prefix={'$'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      value={loanInformation.purchasePrice}
                    />

                    <StyledTextFieldNumber
                      isTooltip={true}
                      label={'Est. construction costs'}
                      onValueChange={({ floatValue }) => {
                        loanInformation.changeFieldValue(
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
                      value={loanInformation.purchaseConstructionCosts}
                    />

                    <StyledTextFieldNumber
                      decimalScale={0}
                      isTooltip={true}
                      label={'Loan to total cost'}
                      onValueChange={({ floatValue }) => {
                        loanInformation.changeFieldValue('ltc', floatValue);
                      }}
                      suffix={'%'}
                      sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      thousandSeparator={false}
                      tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                      tooltipTitle={
                        'Your total loan amount as a % of your purchase price and estimated construction costs.'
                      }
                      value={loanInformation.ltc}
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
                        loanInformation.changeFieldValue('arv', floatValue);
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
                      value={loanInformation.arv}
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
                      loanInformation.changeFieldValue(
                        'purchasePrice',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.purchasePrice}
                  />

                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'Improvements since acquisition'}
                    onValueChange={({ floatValue }) =>
                      loanInformation.changeFieldValue(
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
                    value={loanInformation.improvementsSinceAcquisition}
                  />

                  <StyledTextFieldNumber
                    decimalScale={0}
                    isTooltip={true}
                    label={'Loan to total cost'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue('ltc', floatValue);
                    }}
                    suffix={'%'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    thousandSeparator={false}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={
                      'Your total loan amount as a % of your purchase price and estimated construction costs.'
                    }
                    value={loanInformation.ltc}
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
                      loanInformation.changeFieldValue(
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
                    value={loanInformation.refinanceConstructionCosts}
                  />

                  <StyledTextFieldNumber
                    isTooltip={true}
                    label={'Completed/After-repair value (ARV)'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue('arv', floatValue);
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
                    value={loanInformation.arv}
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
          case LoanProductCategoryEnum.dscr_rental: {
            if (loanInformation.loanPurpose === LoanPurposeEnum.purchase) {
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
                      loanInformation.changeFieldValue(
                        'purchasePrice',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.purchasePrice}
                  />

                  <StyledTextFieldNumber
                    label={'Purchase loan amount'}
                    onValueChange={({ floatValue }) => {
                      loanInformation.changeFieldValue(
                        'purchaseLoanAmount',
                        floatValue,
                      );
                    }}
                    prefix={'$'}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    value={loanInformation.purchaseLoanAmount}
                  />

                  <StyledSelectTextField
                    fieldLabel={'Prepayment penalty'}
                    fieldType={'text'}
                    fieldValue={prepaymentField}
                    isTooltip={true}
                    onFieldChange={(e) => {
                      setPrepaymentField(e.target.value);
                      loanInformation.changeFieldValue(
                        'prepaymentPenalty',
                        e.target.value as string as PrepaymentPenaltyEnum,
                      );
                    }}
                    onSelectChange={(v) => {
                      setPrepaymentSelect(v as string);
                      loanInformation.changeFieldValue(
                        'prepaymentPenalty',
                        v as string as PrepaymentPenaltyEnum,
                      );
                    }}
                    options={prepaymentPenaltyOptions}
                    selectLabel={'Prepayment penalty'}
                    selectValue={prepaymentSelect}
                    sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={
                      <Stack gap={0.5}>
                        <Typography fontSize={12}>
                          <b>Prepayment penalty</b> is a fee you’ll owe if you
                          pay off or refinance the DSCR loan before the penalty
                          period ends.
                        </Typography>
                        <Typography fontSize={12} ml={1.5}>
                          <b>Step-down: </b>the fee falls each year. Example
                          5-4-3-2-1 = 5 % of the outstanding balance in year 1,
                          4 % in year 2, 3 % in year 3, and so on.
                        </Typography>
                        <Typography fontSize={12} ml={1.5}>
                          <b>Straight-line:</b> the fee stays the same each
                          year. Example 1-1-1-1-1 = 1 % every year for five
                          years.
                        </Typography>
                        <Typography fontSize={12}>
                          Pick a schedule in the dropdown, or type in “Not
                          sure”.
                        </Typography>
                      </Stack>
                    }
                  />
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
                  label={'Estimated home value'}
                  onValueChange={({ floatValue }) =>
                    loanInformation.changeFieldValue(
                      'propertyValue',
                      floatValue,
                    )
                  }
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={loanInformation.propertyValue}
                />
                <StyledTextFieldNumber
                  label={'Loan amount'}
                  onValueChange={({ floatValue }) =>
                    loanInformation.changeFieldValue(
                      'refinanceLoanAmount',
                      floatValue,
                    )
                  }
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={loanInformation.refinanceLoanAmount}
                />
                <StyledSelectTextField
                  fieldLabel={'Payoff amount'}
                  fieldValue={loanInformation.payoffAmount}
                  isTooltip={true}
                  onFieldChange={(floatValue) =>
                    loanInformation.changeFieldValue('payoffAmount', floatValue)
                  }
                  onSelectChange={(value) => {
                    loanInformation.changeFieldValue(
                      'isPayoff',
                      value === LoanAnswerEnum.yes,
                    );
                  }}
                  selectLabel={'Payoff amount'}
                  selectValue={
                    loanInformation.isPayoff
                      ? LoanAnswerEnum.yes
                      : LoanAnswerEnum.no
                  }
                  sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    'The total amount needed to fully repay your existing loan. If not sure, please open the dropdown menu on the right side of the textfield and select "Not sure".'
                  }
                  validate={payoffAmountError}
                />
                <StyledSelectTextField
                  fieldLabel={'Prepayment penalty'}
                  fieldType={'text'}
                  fieldValue={prepaymentField}
                  isTooltip={true}
                  onFieldChange={(e) => {
                    setPrepaymentField(e.target.value);
                    loanInformation.changeFieldValue(
                      'prepaymentPenalty',
                      e.target.value as string as PrepaymentPenaltyEnum,
                    );
                  }}
                  onSelectChange={(v) => {
                    setPrepaymentSelect(v as string);
                    loanInformation.changeFieldValue(
                      'prepaymentPenalty',
                      v as string as PrepaymentPenaltyEnum,
                    );
                  }}
                  options={prepaymentPenaltyOptions}
                  selectLabel={'Prepayment penalty'}
                  selectValue={prepaymentSelect}
                  sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                  tooltipTitle={
                    <Stack gap={0.5}>
                      <Typography fontSize={12}>
                        <b>Prepayment penalty</b> is a fee you’ll owe if you pay
                        off or refinance the DSCR loan before the penalty period
                        ends.
                      </Typography>
                      <Typography fontSize={12} ml={1.5}>
                        <b>Step-down: </b>the fee falls each year. Example
                        5-4-3-2-1 = 5 % of the outstanding balance in year 1, 4
                        % in year 2, 3 % in year 3, and so on.
                      </Typography>
                      <Typography fontSize={12} ml={1.5}>
                        <b>Straight-line:</b> the fee stays the same each year.
                        Example 1-1-1-1-1 = 1 % every year for five years.
                      </Typography>
                      <Typography fontSize={12}>
                        Pick a schedule in the dropdown, or type in “Not sure”.
                      </Typography>
                    </Stack>
                  }
                />
              </Stack>
            );
          }
          default:
            return <></>;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        ARLTV,
        LTC,
        LTV,
        breakpoints,
        prepaymentPenaltyOptions,
        prepaymentSelect,
        prepaymentField,
        loanInformation.productCategory,
        loanInformation.loanPurpose,
        loanInformation.propertyType,
        loanInformation.propertyUnit,
        loanInformation.state,
        loanInformation.ficoScore,
        loanInformation.isLiquidity,
        loanInformation.liquidityAmount,
        loanInformation.rehabCost,
        loanInformation.arv,
        loanInformation.purchasePrice,
        loanInformation.purchaseLoanAmount,
        loanInformation.propertyValue,
        loanInformation.refinanceLoanAmount,
        loanInformation.isPayoff,
        loanInformation.payoffAmount,
        loanInformation.isCustom,
        loanInformation.loanTerm,
        loanInformation.interestRate,
        loanInformation.isDutch,
        loanInformation.citizenship,
        loanInformation.priorExperience,
        loanInformation.improvementsSinceAcquisition,
        loanInformation.constructionProjectsExited,
        loanInformation.purchaseConstructionCosts,
        loanInformation.refinanceConstructionCosts,
        loanInformation.ltc,
        loanInformation.monthlyIncome,
        loanInformation.propertyInsurance,
        loanInformation.propertyTaxes,
        loanInformation.monthlyHoaFee,
        loanInformation.prepaymentPenalty,
        loanInformation.acquisitionDate,
        payoffAmountError,
      ],
    );

    const renderTail = useMemo(() => {
      const condition = ['xs', 'sm', 'md'].includes(breakpoints);
      const futureConstructionFunding =
        loanInformation.loanPurpose === LoanPurposeEnum.purchase
          ? loanInformation.purchaseConstructionCosts
          : loanInformation.refinanceConstructionCosts;

      const initialDisbursement = Math.max(
        (totalLoanAmount ?? 0) - (futureConstructionFunding ?? 0),
        0,
      );

      const firstLine = (
        <Stack
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={{ xs: 1.5, lg: 3 }}
        >
          {loanInformation.productCategory ===
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

      if (
        !condition ||
        loanInformation.productCategory === LoanProductCategoryEnum.dscr_rental
      ) {
        return firstLine;
      }

      return (
        <>
          {firstLine}

          <Stack flex={1} mt={-1.5}>
            {loanInformation.productCategory !==
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

                {loanInformation.productCategory !==
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
      loanInformation.loanPurpose,
      loanInformation.productCategory,
      loanInformation.purchaseConstructionCosts,
      loanInformation.refinanceConstructionCosts,
      totalLoanAmount,
    ]);

    // Reusable DSCR tooltip component
    const TitleTooltip = (title = 'DSCR information') =>
      title === 'DSCR information' ? (
        <StyledTooltip
          mode={'controlled'}
          placement={'top'}
          theme={'main'}
          title={
            'We use your Debt Service Coverage Ratio, along with other information like your FICO score, to determine your approved loan amount.'
          }
        >
          <Typography width={'fit-content'}>{title}</Typography>
        </StyledTooltip>
      ) : (
        <Typography width={'fit-content'}>{title}</Typography>
      );

    // Reusable common DSCR input fields
    const CommonInputFields = useMemo(
      () => (
        <Stack
          alignItems={{ xs: 'flex-start', lg: 'stretch' }}
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={3}
          ml={-0.5}
        >
          <StyledTextFieldNumber
            InputLabelProps={{ shrink: true }}
            label={'Monthly gross rental income'}
            onValueChange={({ floatValue }) =>
              loanInformation.changeFieldValue('monthlyIncome', floatValue)
            }
            prefix={'$'}
            sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
            value={loanInformation.monthlyIncome}
          />
          <StyledTextFieldNumber
            InputLabelProps={{ shrink: true }}
            label={'Annual operating expenses '}
            onValueChange={({ floatValue }) =>
              loanInformation.changeFieldValue('operatingExpense', floatValue)
            }
            prefix={'$'}
            sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
            value={loanInformation.operatingExpense}
          />
          <StyledTextFieldNumber
            InputLabelProps={{ shrink: true }}
            label={'Annual insurance'}
            onValueChange={({ floatValue }) =>
              loanInformation.changeFieldValue('propertyInsurance', floatValue)
            }
            prefix={'$'}
            sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
            value={loanInformation.propertyInsurance}
          />
          <StyledTextFieldNumber
            InputLabelProps={{ shrink: true }}
            label={'Annual property taxes'}
            onValueChange={({ floatValue }) =>
              loanInformation.changeFieldValue('propertyTaxes', floatValue)
            }
            prefix={'$'}
            sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
            value={loanInformation.propertyTaxes}
          />
        </Stack>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        loanInformation.monthlyIncome,
        loanInformation.operatingExpense,
        loanInformation.propertyInsurance,
        loanInformation.propertyTaxes,
        loanInformation.productCategory,
      ],
    );

    // Vacancy rate field component
    const VacancyRateField = useMemo(
      () => (
        <StyledTextFieldNumber
          InputLabelProps={{ shrink: true }}
          label={'Vacancy rate'}
          onValueChange={({ floatValue }) =>
            loanInformation.changeFieldValue('vacancyRate', floatValue)
          }
          percentage={true}
          suffix={'%'}
          sx={{ width: { xs: '100%', lg: 220 }, ml: -0.5 }}
          thousandSeparator={false}
          value={loanInformation.vacancyRate}
        />
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [loanInformation.vacancyRate],
    );

    // HOA fee field component
    const HOAFeeField = useMemo(
      () => (
        <StyledTextFieldNumber
          InputLabelProps={{ shrink: true }}
          label={'Monthly HOA fee'}
          onValueChange={({ floatValue }) =>
            loanInformation.changeFieldValue('monthlyHoaFee', floatValue)
          }
          prefix={' $'}
          sx={{ width: { xs: '100%', lg: 220 }, ml: -0.5 }}
          thousandSeparator={false}
          value={loanInformation.monthlyHoaFee}
        />
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [loanInformation.monthlyHoaFee],
    );

    // DSCR calculation display component
    const DSCRCalculationInfo = useMemo(
      () => (
        <Stack gap={1} mt={1}>
          <Typography color={'text.secondary'} fontSize={{ xs: 12, lg: 16 }}>
            Loan terms will be provided after you complete the application and
            our underwriting team reviews your submission.
          </Typography>
        </Stack>
      ),
      [],
    );

    // Simple loan terms message
    const LoanTermsMessage = () => (
      <Typography color={'text.secondary'} fontSize={{ xs: 12, lg: 16 }}>
        Loan terms will be provided after you complete the application and our
        underwriting team reviews your submission.
      </Typography>
    );

    // Bridge and Fix component
    const renderExtraBridgeAndFix = useMemo(
      () => {
        return (
          <Stack gap={3} mt={3}>
            {TitleTooltip('Multifamily information')}
            {CommonInputFields}
            {VacancyRateField}
          </Stack>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [CommonInputFields, VacancyRateField],
    );

    // DSCR component with conditional rendering based on property type
    const renderExtraDSCR = useMemo(
      () => {
        switch (loanInformation.propertyType) {
          case LoanPropertyTypeEnum.condo:
            return (
              <Stack gap={3} mt={3}>
                {TitleTooltip()}
                {CommonInputFields}
                {HOAFeeField}
                {DSCRCalculationInfo}
              </Stack>
            );
          case LoanPropertyTypeEnum.multifamily:
            return (
              <Stack gap={3} mt={3}>
                {TitleTooltip()}
                {CommonInputFields}
                {VacancyRateField}
                {DSCRCalculationInfo}
              </Stack>
            );
          default:
            return (
              <Stack gap={3} mt={3}>
                {TitleTooltip()}
                {CommonInputFields}
                <LoanTermsMessage />
              </Stack>
            );
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        prepaymentPenaltyOptions,
        VacancyRateField,
        HOAFeeField,
        DSCRCalculationInfo,
        CommonInputFields,
        loanInformation.propertyType,
        loanInformation.productCategory,
      ],
    );

    const renderExtraTextField = useMemo(() => {
      switch (loanInformation.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
        case LoanProductCategoryEnum.fix_and_flip:
          return renderExtraBridgeAndFix;
        case LoanProductCategoryEnum.dscr_rental:
          return renderExtraDSCR;
        case LoanProductCategoryEnum.ground_up_construction:
        case LoanProductCategoryEnum.default:
        default:
          return null;
      }
    }, [
      loanInformation.productCategory,
      renderExtraDSCR,
      renderExtraBridgeAndFix,
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

    useEffect(() => {
      if (
        !loanInformation.prepaymentPenalty &&
        prepaymentPenaltyOptions?.length > 0
      ) {
        loanInformation.changeFieldValue(
          'prepaymentPenalty',
          prepaymentPenaltyOptions[0].value as string as PrepaymentPenaltyEnum,
        );
      }
    }, [loanInformation, prepaymentPenaltyOptions]);

    return (
      <StyledFormItem
        label={'Enter loan information'}
        m={'0 auto'}
        maxWidth={976}
        tip={renderTip}
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
                  loanInformation.changeFieldValue(
                    'citizenship',
                    e.target.value as string as LoanCitizenshipEnum,
                  );
                }}
                options={OPTIONS_COMMON_CITIZEN_TYPE}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={loanInformation.citizenship}
              />
              <StyledTextFieldNumber
                isTooltip={true}
                label={
                  loanInformation.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction
                    ? '# of prior flips'
                    : '# of construction projects exited'
                }
                onValueChange={({ floatValue }) => {
                  loanInformation.changeFieldValue(
                    'priorExperience',
                    floatValue,
                  );
                }}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                tooltipTitle={
                  loanInformation.productCategory !==
                  LoanProductCategoryEnum.ground_up_construction
                    ? 'Number of flips completed and held rental properties'
                    : 'The number of investment properties you have built and exited over the last 5 years'
                }
                value={loanInformation.priorExperience}
              />
              {loanInformation.productCategory ===
                LoanProductCategoryEnum.dscr_rental &&
                loanInformation.loanPurpose === LoanPurposeEnum.refinance && (
                  <StyledDatePicker
                    disableFuture={false}
                    disablePast={false}
                    isTooltip={true}
                    label={'Prop. acquisition date'}
                    onChange={(date) => {
                      const value =
                        isValid(date) && isDate(date)
                          ? (date as Date).toISOString()
                          : '';
                      loanInformation.changeFieldValue(
                        'acquisitionDate',
                        value,
                      );
                    }}
                    sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipSx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                    tooltipTitle={
                      'YouLand requires a minimum of 90 days of ownership before the signing date for a Cash-Out Refinance. However, this requirement does not apply to properties owned free-and-clear or for Rate-Term Refinances. To confirm eligibility, YouLand will verify the acquisition date, defined as the closing date of the subject property.'
                    }
                    value={
                      loanInformation.acquisitionDate
                        ? new Date(loanInformation.acquisitionDate)
                        : null
                    }
                  />
                )}
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
                  loanInformation.changeFieldValue(
                    'state',
                    e.target.value as string,
                  );
                }}
                options={OPTIONS_COMMON_STATE}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={loanInformation.state}
              />
              {loanInformation.citizenship !==
                LoanCitizenshipEnum.foreign_national && (
                <StyledSelect
                  label={'Est. FICO score'}
                  onChange={(e) => {
                    loanInformation.changeFieldValue(
                      'ficoScore',
                      e.target.value as string as LoanFicoScoreEnum,
                    );
                  }}
                  options={APPLICATION_FICO_SCORE}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={loanInformation.ficoScore}
                />
              )}
              <StyledSelectTextField
                fieldLabel={'Liquidity'}
                fieldValue={loanInformation.liquidityAmount}
                isTooltip={true}
                onFieldChange={(floatValue) =>
                  loanInformation.changeFieldValue(
                    'liquidityAmount',
                    floatValue,
                  )
                }
                onSelectChange={(value) => {
                  loanInformation.changeFieldValue(
                    'isLiquidity',
                    value === LoanAnswerEnum.yes,
                  );
                }}
                options={APPLICATION_LIQUIDITY}
                selectLabel={'Liquidity'}
                selectValue={
                  loanInformation.isLiquidity
                    ? LoanAnswerEnum.yes
                    : LoanAnswerEnum.no
                }
                sx={{ maxWidth: { xs: '100%', lg: 220 } }}
                tooltipTitle={
                  'Liquidity means the cash or readily available funds you have, like savings or liquid investments. If unsure, use the dropdown menu on the right and select "Not sure".'
                }
              />
            </Stack>

            {renderEditFields}

            {renderTail}

            {renderExtraTextField}
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={{ xs: 6, lg: 8 }}
          mx={'auto'}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState || !totalLoanAmount || totalLoanAmount <= 0}
            id={'application-loan-information-next-button'}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'contained'}
          >
            Next
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
