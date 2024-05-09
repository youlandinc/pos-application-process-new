import { FC, useEffect, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AddCircleTwoTone } from '@mui/icons-material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useStoreData } from '@/hooks';

import { POSFormatDollar } from '@/utils';
import { LoanSnapshotEnum } from '@/types';

import { StyledButton, StyledTextFieldNumber } from '@/components/atoms';

export const ProductCustomItem: FC<{ totalLoanAmount?: number }> = observer(
  ({ totalLoanAmount }) => {
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

    const monthlyPayment = useMemo(() => {
      if (
        !estimateRate?.interestRate ||
        !estimateRate?.loanTerm ||
        !totalLoanAmount
      ) {
        return 0;
      }
      return (
        ((estimateRate.interestRate / 100) * totalLoanAmount) /
        estimateRate.loanTerm
      );
    }, [estimateRate?.interestRate, estimateRate?.loanTerm, totalLoanAmount]);

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
                percentage={true}
                placeholder={'Interest rate'}
                size={'small'}
                suffix={'%'}
                sx={{ width: 160 }}
                value={estimateRate.interestRate}
              />
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              height={40}
              justifyContent={'space-between'}
            >
              <Typography variant={'body1'}>Monthly payment</Typography>
              <Typography variant={'h6'}>
                {POSFormatDollar(monthlyPayment)}
              </Typography>
            </Stack>

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
  },
);
