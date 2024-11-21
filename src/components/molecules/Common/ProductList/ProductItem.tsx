import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import {
  LoanProductCategoryEnum,
  LoanSnapshotEnum,
  ProductItemProps,
} from '@/types';

import { StyledButton, StyledTooltip } from '@/components/atoms';

export const ProductItem: FC<ProductItemProps> = observer(
  ({
    loanTerm,
    interestRate,
    monthlyPayment,
    lowest,
    initialMonthlyPayment,
    fullyDrawnMonthlyPayment,
  }) => {
    const { applicationForm } = useMst();
    const { estimateRate } = applicationForm;

    const { updateFormState, updateFrom } = useStoreData();

    const handledClick = async () => {
      const postData = {
        data: {
          ...estimateRate.getPostData(),
          isCustom: false,
          loanTerm,
          interestRate,
        },
        snapshot: LoanSnapshotEnum.estimate_rate,
        nextSnapshot: applicationForm.isBind
          ? LoanSnapshotEnum.loan_address
          : LoanSnapshotEnum.auth_page,
        loanId: applicationForm.loanId,
      };
      await updateFrom(postData);
    };

    const renderTail = useMemo(() => {
      switch (estimateRate.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          return (
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              height={40}
              justifyContent={'space-between'}
            >
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                fontSize={16}
                gap={1}
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
        overflow={'hidden'}
        p={4}
        position={'relative'}
        sx={{
          transition: 'border-color .3s',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
        width={{ xs: '100%', md: 'calc(50% - 12px)' }}
      >
        {lowest && (
          <Stack
            alignItems={'center'}
            bgcolor={'primary.lighter'}
            color={'primary.main'}
            height={24}
            justifyContent={'center'}
            sx={{
              position: 'absolute',
              zIndex: 10,
              top: 0,
              left: 0,
              fontSize: 12,
            }}
            width={'100%'}
          >
            Lowest rate
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={40}
          justifyContent={'space-between'}
        >
          <Typography variant={'body1'}>Term</Typography>
          <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
            {loanTerm} months
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={40}
          justifyContent={'space-between'}
        >
          <Typography variant={'body1'}>Rate</Typography>
          <Typography fontSize={{ xs: 16, lg: 20 }} variant={'h6'}>
            {POSFormatPercent(interestRate)}
          </Typography>
        </Stack>

        {renderTail}

        <StyledButton
          color={'primary'}
          disabled={updateFormState.loading}
          loading={updateFormState.loading}
          onClick={handledClick}
          sx={{ mt: 1.5 }}
        >
          Select
        </StyledButton>
      </Stack>
    );
  },
);
