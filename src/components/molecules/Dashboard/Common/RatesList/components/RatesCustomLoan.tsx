import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AddCircleTwoTone } from '@mui/icons-material';

import { CustomRateData, UserType } from '@/types';

import { StyledButton, StyledTextFieldNumber } from '@/components/atoms';

interface RatesCustomLoanProps {
  userType: UserType;
  customLoan: CustomRateData;
  setCustomLoan: Dispatch<SetStateAction<CustomRateData>>;
  onCustomLoanClick?: () => void;
  customLoading: boolean;
  productType?: string | 'CUSTOM_LOAN';
}

export const RatesCustomLoan: FC<RatesCustomLoanProps> = ({
  userType,
  customLoan,
  setCustomLoan,
  onCustomLoanClick,
  customLoading,
  productType,
}) => {
  const [mode, setMode] = useState<'edit' | 'default'>(
    customLoan?.customRate ? 'edit' : 'default',
  );

  return (
    <Stack
      alignItems={'center'}
      border={'2px solid #D2D6E1'}
      borderRadius={2}
      gap={3}
      justifyContent={'center'}
      minHeight={userType !== UserType.CUSTOMER ? 320 : 246}
      onClick={() => setMode('edit')}
      p={3}
      sx={{
        transition: 'all .3s',
        cursor: mode === 'default' ? 'pointer' : 'default',
        '&:hover': { borderColor: 'primary.main' },
      }}
      width={{ xl: 'calc(50% - 12px)', xs: '100%' }}
    >
      {mode === 'default' ? (
        <Stack alignItems={'center'} mb={7}>
          <Typography color={'text.primary'} pb={4} variant={'h5'}>
            Use custom loan terms
          </Typography>
          <AddCircleTwoTone
            sx={{
              width: 48,
              height: 48,
              color: 'primary.main',
              '& path:nth-of-type(1)': {
                opacity: '.15 !important',
              },
            }}
          />
        </Stack>
      ) : (
        <Stack flex={1} gap={3} justifyContent={'space-between'} width={'100%'}>
          <Stack flex={1} gap={3} justifyContent={'space-around'}>
            {userType !== UserType.CUSTOMER && (
              <Typography textAlign={'center'} variant={'h6'}>
                Use custom loan terms
              </Typography>
            )}
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={customLoading}
              label={'Interest rate'}
              onValueChange={({ floatValue }) => {
                setCustomLoan({
                  ...customLoan,
                  interestRate: floatValue,
                });
              }}
              percentage
              suffix={'%'}
              thousandSeparator={false}
              value={customLoan?.interestRate}
            />
            <StyledTextFieldNumber
              decimalScale={0}
              disabled={customLoading}
              label={'Loan term (months)'}
              onValueChange={({ floatValue }) => {
                setCustomLoan({
                  ...customLoan,
                  loanTerm: floatValue,
                });
              }}
              percentage={false}
              thousandSeparator={false}
              value={customLoan?.loanTerm}
            />
          </Stack>

          <StyledButton
            disabled={
              !customLoan?.interestRate ||
              !customLoan?.loanTerm ||
              customLoading
            }
            loading={customLoading}
            onClick={onCustomLoanClick}
            sx={{ height: 56 }}
            variant={productType === 'CUSTOM_LOAN' ? 'outlined' : 'contained'}
          >
            {productType === 'CUSTOM_LOAN' ? 'Current rate' : 'View details'}
          </StyledButton>
        </Stack>
      )}
    </Stack>
  );
};
