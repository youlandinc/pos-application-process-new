import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSNotUndefined,
} from '@/utils';

import {
  HttpError,
  LoanAnswerEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPurposeEnum,
  ProductItemProps,
} from '@/types';

import { useBreakpoints, useDebounceFn, useSessionStorageState } from '@/hooks';

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
import { _fetchProductList } from '@/requests/application';
import { enqueueSnackbar } from 'notistack';

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

    const fetchProductList = async () => {
      const postData = {
        tenantId: saasState?.tenantId || '1000052023020700000112',
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
            : estimateRate.refinanceLoanAmount;
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

    const LTV = useMemo(() => {
      return estimateRate.loanPurpose === LoanPurposeEnum.purchase
        ? (estimateRate.purchaseLoanAmount ?? 0) /
            (estimateRate.purchasePrice ?? 0)
        : (estimateRate.refinanceLoanAmount ?? 0) /
            (estimateRate.propertyValue ?? 0);
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
        return estimateRate.loanPurpose === LoanPurposeEnum.purchase
          ? ((estimateRate?.purchaseLoanAmount ?? 0) +
              (estimateRate?.rehabCost ?? 0)) /
              ((estimateRate?.purchasePrice ?? 0) +
                (estimateRate?.rehabCost ?? 0))
          : ((estimateRate.refinanceLoanAmount ?? 0) +
              (estimateRate?.rehabCost ?? 0)) /
              ((estimateRate.propertyValue ?? 0) +
                (estimateRate?.rehabCost ?? 0));
      }
      return 0;
    }, [
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.propertyValue,
      estimateRate?.purchaseLoanAmount,
      estimateRate?.purchasePrice,
      estimateRate.refinanceLoanAmount,
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
                variant={'body1'}
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
              variant={'body1'}
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
                variant={'body1'}
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
              variant={'body1'}
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
      estimateRate.ficoScore,
      estimateRate.isLiquidity,
      estimateRate.liquidityAmount,
      estimateRate.loanPurpose,
      estimateRate.productCategory,
      estimateRate.propertyValue,
      estimateRate.purchasePrice,
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
        setLoading(true);
        run();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
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
        labelSx={{
          textAlign: { lg: 'left', xs: 'center' },
          m: 0,
        }}
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
          textAlign: { lg: 'left', xs: 'center' },
          color: 'text.primary',
          m: 0,
          mt: 1,
        }}
      >
        {POSNotUndefined(expanded) && !expanded && (
          <Stack
            alignItems={'center'}
            gap={3}
            justifyContent={'space-between'}
            mt={3}
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
          <Stack gap={3} mt={{ xs: 3, lg: 4 }} width={'100%'}>
            <Stack
              alignItems={{ xs: 'flex-start', lg: 'center' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
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
                  <Stack flex={1} maxWidth={240}>
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
              alignItems={{ xs: 'flex-start', lg: 'center' }}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
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

              {['xs', 'sm', 'md'].includes(breakpoints) && (
                <Stack flex={1} maxWidth={240} width={'100%'}>
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
                />
              )}

              {!['xs', 'sm', 'md'].includes(breakpoints) && (
                <Stack flex={1}>
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

            {[
              LoanProductCategoryEnum.fix_and_flip,
              LoanProductCategoryEnum.ground_up_construction,
            ].includes(estimateRate.productCategory) && (
              <Stack
                alignItems={{ xs: 'flex-start', lg: 'center' }}
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
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

            {['xs', 'sm', 'md'].includes(breakpoints) && (
              <Stack flex={1}>
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

            <Typography
              color={'text.secondary'}
              sx={{ '& > span': { color: 'primary.main', fontWeight: 600 } }}
              variant={'h7'}
            >
              Total loan amount: <span>{POSFormatDollar(totalLoanAmount)}</span>
            </Typography>
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
          />
        </Stack>

        <Stack alignItems={'center'} mt={{ xs: 3, lg: 10 }} width={'100%'}>
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
