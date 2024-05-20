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
              'Payoff amount must be equal to or less than the refinance loan amount',
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
        default:
          return 0;
      }
    }, [
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.purchaseLoanAmount,
      estimateRate.refinanceLoanAmount,
      estimateRate.rehabCost,
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
        default:
          return '';
      }
    }, [
      estimateRate.arv,
      estimateRate.ficoScore,
      estimateRate.isLiquidity,
      estimateRate.liquidityAmount,
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.propertyValue,
      estimateRate.purchasePrice,
      estimateRate.rehabCost,
      estimateRate.state,
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
              <StyledSelectTextField
                fieldLabel={'Liquidity'}
                fieldValue={estimateRate.liquidityAmount}
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
              />

              {!['xs', 'sm', 'md'].includes(breakpoints) && (
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
                </>
              )}
            </Stack>

            <Stack
              alignItems={{ xs: 'flex-start', lg: 'stretch' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
              ml={-0.5}
            >
              <StyledTextFieldNumber
                label={
                  estimateRate.loanPurpose === LoanPurposeEnum.refinance
                    ? 'As-is property value'
                    : 'Purchase price'
                }
                onValueChange={({ floatValue }) => {
                  estimateRate.changeFieldValue(
                    estimateRate.loanPurpose === LoanPurposeEnum.refinance
                      ? 'propertyValue'
                      : 'purchasePrice',
                    floatValue,
                  );
                }}
                prefix={'$'}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={
                  estimateRate.loanPurpose === LoanPurposeEnum.refinance
                    ? estimateRate.propertyValue
                    : estimateRate.purchasePrice
                }
              />

              <StyledTextFieldNumber
                label={
                  estimateRate.loanPurpose === LoanPurposeEnum.refinance
                    ? 'Refinance loan amount'
                    : 'Purchase loan amount'
                }
                onValueChange={({ floatValue }) => {
                  estimateRate.changeFieldValue(
                    estimateRate.loanPurpose === LoanPurposeEnum.refinance
                      ? 'refinanceLoanAmount'
                      : 'purchaseLoanAmount',
                    floatValue,
                  );
                }}
                prefix={'$'}
                sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                value={
                  estimateRate.loanPurpose === LoanPurposeEnum.refinance
                    ? estimateRate.refinanceLoanAmount
                    : estimateRate.purchaseLoanAmount
                }
              />

              {estimateRate.loanPurpose === LoanPurposeEnum.refinance && (
                <StyledSelectTextField
                  fieldLabel={'Payoff amount'}
                  fieldValue={estimateRate.payoffAmount}
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
                  validate={payoffAmountError}
                />
              )}

              {!['xs', 'sm', 'md'].includes(breakpoints) && (
                <Stack flex={1} mt={0.5}>
                  {[
                    LoanProductCategoryEnum.fix_and_flip,
                    LoanProductCategoryEnum.ground_up_construction,
                  ].includes(estimateRate.productCategory) ? (
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
                        <b>{POSFormatPercent(LTV, POSGetDecimalPlaces(LTV))}</b>
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
              )}
            </Stack>

            {[
              LoanProductCategoryEnum.fix_and_flip,
              LoanProductCategoryEnum.ground_up_construction,
            ].includes(estimateRate.productCategory) && (
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
                  label={'After repair value (ARV)'}
                  onValueChange={({ floatValue }) => {
                    estimateRate.changeFieldValue('arv', floatValue);
                  }}
                  prefix={'$'}
                  sx={{ flex: 1, maxWidth: { xs: '100%', lg: 220 } }}
                  value={estimateRate.arv}
                />
              </Stack>
            )}

            <Typography
              color={'text.secondary'}
              sx={{ '& > span': { color: 'primary.main', fontWeight: 600 } }}
              variant={'h7'}
            >
              Total loan amount: <span>{POSFormatDollar(totalLoanAmount)}</span>
            </Typography>

            {['xs', 'sm', 'md'].includes(breakpoints) && (
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

            {['xs', 'sm', 'md'].includes(breakpoints) && (
              <Stack flex={1} mt={-1.5}>
                {[
                  LoanProductCategoryEnum.fix_and_flip,
                  LoanProductCategoryEnum.ground_up_construction,
                ].includes(estimateRate.productCategory) ? (
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
                      <b>{POSFormatPercent(LTV, 1)}</b>
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
                      Loan to cost: <b>{POSFormatPercent(LTC, 1)}</b>
                    </Typography>
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
            )}
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
            totalLoanAmount={
              estimateRate.isDutch
                ? totalLoanAmount
                : totalLoanAmountWithoutDutch
            }
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
