import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { observer } from 'mobx-react-lite';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { LoanSnapshotEnum, ProductItemProps } from '@/types';

import { StyledButton, StyledTooltip } from '@/components/atoms';
import { useStoreData } from '@/hooks';
import { useMst } from '@/models/Root';

export const ProductItem: FC<ProductItemProps> = observer(
  ({ loanTerm, interestRate, monthlyPayment, lowest, selected, id }) => {
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
          <Typography variant={'h6'}>{loanTerm} months</Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={40}
          justifyContent={'space-between'}
        >
          <Typography variant={'body1'}>Rate</Typography>
          <Typography variant={'h6'}>
            {POSFormatPercent(interestRate)}
          </Typography>
        </Stack>

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
            Monthly payment{' '}
            <StyledTooltip
              title={
                'The interest calculation is based on a non-dutch basis and does not include the rehab loan amount.'
              }
            >
              <InfoOutlined
                sx={{
                  width: 16,
                  height: 16,
                  color: 'info.dark',
                  mb: 0.25,
                }}
              />
            </StyledTooltip>
          </Stack>
          <Typography variant={'h6'}>
            {POSFormatDollar(monthlyPayment)}
          </Typography>
        </Stack>

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
