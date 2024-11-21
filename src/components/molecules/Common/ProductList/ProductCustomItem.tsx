import { FC, useEffect, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AddCircleTwoTone, InfoOutlined } from '@mui/icons-material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useStoreData } from '@/hooks';

import { POSFormatDollar } from '@/utils';
import {
  LoanProductCategoryEnum,
  LoanPurposeEnum,
  LoanSnapshotEnum,
} from '@/types';

import {
  StyledButton,
  StyledTextFieldNumber,
  StyledTooltip,
} from '@/components/atoms';

export const ProductCustomItem: FC<{
  totalLoanAmount?: number;
  totalLoanAmountWithoutDutch?: number;
}> = observer(({ totalLoanAmount, totalLoanAmountWithoutDutch }) => {
  const { applicationForm } = useMst();
  const { estimateRate } = applicationForm;

  const [mode, setMode] = useState<'edit' | 'default'>(
    estimateRate.isCustom ? 'edit' : 'default',
  );

  useEffect(() => {
    if (!estimateRate.isCustom) {
      estimateRate.changeFieldValue('loanTerm', void 0);
      estimateRate.changeFieldValue('interestRate', void 0);
    }
  }, [estimateRate]);

  const breakpoints = useBreakpoints();

  const { updateFormState, updateFrom } = useStoreData();

  const handledClick = async () => {
    const postData = {
      data: {
        ...estimateRate.getPostData(),
        interestRate: estimateRate.interestRate! / 100,
        isCustom: true,
      },
      snapshot: LoanSnapshotEnum.estimate_rate,
      nextSnapshot: applicationForm.isBind
        ? LoanSnapshotEnum.loan_address
        : LoanSnapshotEnum.auth_page,
      loanId: applicationForm.loanId,
    };
    await updateFrom(postData);
  };

  const computedLoanAmount = useMemo(() => {
    return estimateRate?.isDutch
      ? totalLoanAmount
      : totalLoanAmountWithoutDutch;
  }, [estimateRate?.isDutch, totalLoanAmount, totalLoanAmountWithoutDutch]);

  const monthlyPayment = useMemo(() => {
    if (
      !estimateRate?.interestRate ||
      !estimateRate?.loanTerm ||
      !computedLoanAmount
    ) {
      return 0;
    }
    return ((estimateRate.interestRate / 100) * computedLoanAmount) / 12;
  }, [estimateRate.interestRate, estimateRate?.loanTerm, computedLoanAmount]);

  const initialMonthlyPayment = useMemo(() => {
    if (!estimateRate?.interestRate || !estimateRate?.loanTerm) {
      return 0;
    }
    const futureConstructionFunding =
      estimateRate?.loanPurpose === LoanPurposeEnum.purchase
        ? (estimateRate?.purchaseConstructionCosts ?? 0)
        : (estimateRate?.refinanceConstructionCosts ?? 0);
    const initialDisbursement = totalLoanAmount || 0;

    const dividend =
      ((initialDisbursement - futureConstructionFunding) *
        estimateRate?.interestRate) /
      100;
    const divisor = 12;

    return dividend / divisor;
  }, [
    estimateRate?.interestRate,
    estimateRate?.loanPurpose,
    estimateRate?.loanTerm,
    estimateRate?.purchaseConstructionCosts,
    estimateRate?.refinanceConstructionCosts,
    totalLoanAmount,
  ]);
  const fullyDrawnMonthlyPayment = useMemo(() => {
    if (
      !estimateRate?.interestRate ||
      !estimateRate?.loanTerm ||
      !totalLoanAmount
    ) {
      return 0;
    }
    return (totalLoanAmount * (estimateRate.interestRate / 100)) / 12;
  }, [estimateRate.interestRate, estimateRate?.loanTerm, totalLoanAmount]);

  const renderTail = useMemo(() => {
    switch (estimateRate.productCategory) {
      case LoanProductCategoryEnum.stabilized_bridge:
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              fontSize={16}
              gap={1}
              height={40}
            >
              Monthly payment
            </Stack>

            <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
              {POSFormatDollar(monthlyPayment)}
            </Typography>
          </Stack>
        );
      case LoanProductCategoryEnum.fix_and_flip:
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            height={40}
            justifyContent={'space-between'}
          >
            <Typography variant={'body1'} width={'fit-content'}>
              Monthly payment
              <StyledTooltip
                mode={'controlled'}
                placement={'top'}
                title={
                  'The interest calculation is based on a non-dutch basis and does not include the rehab loan amount.'
                }
              >
                <InfoOutlined
                  sx={{
                    color: 'info.dark',
                    verticalAlign: 'middle',
                    width: 16,
                    height: 16,
                    ml: 1,
                  }}
                />
              </StyledTooltip>
            </Typography>

            <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
              {POSFormatDollar(monthlyPayment)}
            </Typography>
          </Stack>
        );
      case LoanProductCategoryEnum.ground_up_construction:
        return (
          <>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              height={40}
              justifyContent={'space-between'}
            >
              <Typography variant={'body1'} width={'fit-content'}>
                Est. initial monthly payment
                <StyledTooltip
                  mode={'controlled'}
                  placement={'top'}
                  title={
                    'The estimated monthly payment based on the initial loan disbursement amount.'
                  }
                >
                  <InfoOutlined
                    sx={{
                      color: 'info.dark',
                      verticalAlign: 'middle',
                      width: 16,
                      height: 16,
                      ml: 1,
                    }}
                  />
                </StyledTooltip>
              </Typography>

              <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
                {POSFormatDollar(initialMonthlyPayment)}
              </Typography>
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              height={40}
              justifyContent={'space-between'}
            >
              <Typography variant={'body1'} width={'fit-content'}>
                Est. fully drawn monthly payment
                <StyledTooltip
                  mode={'controlled'}
                  placement={'top'}
                  title={
                    'The estimated monthly payment once the full loan amount, including future construction funding, has been disbursed.'
                  }
                >
                  <InfoOutlined
                    sx={{
                      color: 'info.dark',
                      verticalAlign: 'middle',
                      width: 16,
                      height: 16,
                      ml: 1,
                    }}
                  />
                </StyledTooltip>
              </Typography>

              <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
                {POSFormatDollar(fullyDrawnMonthlyPayment)}
              </Typography>
            </Stack>
          </>
        );
      default:
        return <></>;
    }
  }, [
    estimateRate.productCategory,
    fullyDrawnMonthlyPayment,
    initialMonthlyPayment,
    monthlyPayment,
  ]);

  return (
    <Stack
      border={'2px solid #D2D6E1'}
      borderRadius={2}
      gap={1.5}
      minHeight={292}
      onClick={() => {
        if (mode === 'edit') {
          estimateRate.changeFieldValue('isCustom', true);
          return;
        }
        setMode('edit');
      }}
      overflow={'hidden'}
      p={4}
      sx={{
        transition: 'border-color .3s',
        cursor: mode === 'default' ? 'pointer' : 'default',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
      width={{ xs: '100%', md: 'calc(50% - 12px)' }}
    >
      {mode === 'default' ? (
        <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
          <Typography
            color={'text.primary'}
            pb={3}
            variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h6'}
          >
            Use custom loan terms
          </Typography>
          <AddCircleTwoTone
            sx={{
              width: 36,
              height: 36,
              mb: 6,
              color: 'primary.main',
              '& path:nth-of-type(1)': {
                opacity: '.15 !important',
              },
            }}
          />
        </Stack>
      ) : (
        <>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'body1'}>Term</Typography>
            <StyledTextFieldNumber
              decimalScale={0}
              label={'Months'}
              onValueChange={({ floatValue }) =>
                estimateRate.changeFieldValue('loanTerm', floatValue)
              }
              placeholder={'Months'}
              size={'small'}
              sx={{ width: 160 }}
              value={estimateRate.loanTerm}
            />
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'body1'}>Rate</Typography>
            <StyledTextFieldNumber
              decimalScale={3}
              label={'Interest rate'}
              onValueChange={({ floatValue }) =>
                estimateRate.changeFieldValue('interestRate', floatValue)
              }
              placeholder={'Interest rate'}
              size={'small'}
              suffix={'%'}
              sx={{ width: 160 }}
              value={estimateRate.interestRate}
            />
          </Stack>

          {renderTail}

          <StyledButton
            color={'primary'}
            disabled={
              !estimateRate.interestRate ||
              !estimateRate.loanTerm ||
              updateFormState.loading
            }
            loading={updateFormState.loading}
            onClick={handledClick}
            sx={{ mt: 1.5 }}
          >
            Select
          </StyledButton>
        </>
      )}
    </Stack>
  );
});
