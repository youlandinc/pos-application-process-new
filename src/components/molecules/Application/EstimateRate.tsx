import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
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
  APPLICATION_ESTIMATE_RATE_FICO_SCORE,
  APPLICATION_ESTIMATE_RATE_LIQUIDITY,
  APPLICATION_STARTING_QUESTION_LOAN_CATEGORY,
  APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_TYPE,
  APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_UNIT,
  APPLICATION_STARTING_QUESTION_LOAN_PURPOSE,
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
          APPLICATION_STARTING_QUESTION_LOAN_CATEGORY,
          estimateRate.productCategory,
        )} ${POSFindLabel(
          APPLICATION_STARTING_QUESTION_LOAN_PURPOSE,
          estimateRate.loanPurpose,
        )} | ${
          estimateRate.propertyType !== LoanPropertyTypeEnum.two_to_four_family
            ? POSFindLabel(
                APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_TYPE,
                estimateRate.propertyType,
              )
            : POSFindLabel(
                APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_UNIT,
                estimateRate.propertyUnit,
              )
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
              This property is located in <b>California</b>, the FlCO score is{' '}
              <b>700-750</b>, the liquidity is <b>{POSFormatDollar(100000)}</b>.
              The purchase price is <b>$200,000</b>. The total loan amount is{' '}
              <b>{POSFormatDollar(100000)}</b>.
            </Typography>
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
                options={APPLICATION_ESTIMATE_RATE_FICO_SCORE}
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
                options={APPLICATION_ESTIMATE_RATE_LIQUIDITY}
                selectLabel={'Liquidity'}
                selectValue={
                  estimateRate.isLiquidity
                    ? LoanAnswerEnum.yes
                    : LoanAnswerEnum.no
                }
                sx={{ maxWidth: { xs: '100%', lg: 220 } }}
              />

              {!['xs', 'sm', 'md'].includes(breakpoints) && (
                <Stack flex={1} maxWidth={240}>
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
                    <b>{POSFormatDollar(1000000)}</b> and{' '}
                    <b>{POSFormatDollar(1000000)}</b>.
                  </Typography>
                </Stack>
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
                <Stack flex={1} maxWidth={240}>
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
                    <b>{POSFormatDollar(1000000)}</b> and{' '}
                    <b>{POSFormatDollar(1000000)}</b>.
                  </Typography>
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
                    'purchaseLoanAmount',
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
                        <b>{POSFormatPercent(0.1, 1)}</b>
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
                        Loan to cost: <b>{POSFormatPercent(0.12345, 1)}</b>
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
                      Loan to value: <b>{POSFormatPercent(0.1, 1)}</b>
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
                      <b>{POSFormatPercent(0.1, 1)}</b>
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
                      Loan to cost: <b>{POSFormatPercent(0.12345, 1)}</b>
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
                    Loan to value: <b>{POSFormatPercent(0.1, 1)}</b>
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
          />
        </Stack>

        <Stack alignItems={'center'} mt={10} width={'100%'}>
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
