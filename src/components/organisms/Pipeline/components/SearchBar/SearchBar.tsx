import { UserType } from '@/types';
import { FC, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Close, FilterAltOutlined, SearchOutlined } from '@mui/icons-material';

import {
  OPTIONS_LOAN_PURPOSE,
  OPTIONS_LOAN_SPECIES,
  OPTIONS_LOAN_STAGE,
} from '@/constants';

import { useBreakpoints, useSwitch } from '@/hooks';
import {
  StyledButton,
  StyledDateRange,
  StyledDrawer,
  StyledSelectMultiple,
  StyledTextField,
} from '@/components/atoms';

export interface SearchBarProps {
  searchForm: {
    propertyAddress: string;
    loanStage: string[];
    loanSpecies: string[];
    loanPurpose: string[];
    dateRange: [Date | null, Date | null];
  };
  onParamsChange: (
    k: keyof SearchBarProps['searchForm'],
    v: string | string[] | [Date | null, Date | null] | boolean,
  ) => void;
  onValueChange: (v: boolean) => void;
  userType: UserType;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchForm,
  onParamsChange,
  onValueChange,
  userType,
}) => {
  const breakpoint = useBreakpoints();

  const { visible, open, close } = useSwitch(false);

  const role = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return 'for Broker';
      case UserType.LENDER:
        return 'for Table Funding';
      case UserType.LOAN_OFFICER:
        return 'for Loan Officer';
      case UserType.REAL_ESTATE_AGENT:
        return 'for Real Estate Agent';
      default:
        return '';
    }
  }, [userType]);

  return (
    <Stack
      alignItems={{ xs: 'center', xl: 'unset' }}
      flexDirection={{ xs: 'row', xl: 'column' }}
      justifyContent={{ xs: 'space-between', xl: 'unset' }}
    >
      <Typography variant={'h4'}>
        Pipeline{' '}
        <Typography color={'#9DAEEB'} component={'span'} variant={'inherit'}>
          {role}
        </Typography>
      </Typography>
      {['xs', 'sm', 'md', 'lg'].includes(breakpoint) ? (
        <>
          <StyledButton
            color={'info'}
            isIconButton
            onClick={() => (visible ? close() : open())}
          >
            <FilterAltOutlined />
          </StyledButton>

          <StyledDrawer
            anchor={'right'}
            content={
              <Stack
                flexDirection={'column'}
                gap={3}
                sx={{
                  p: 3,
                  '& .search_condition': {
                    flex: 1,
                    width: '100%',
                  },
                }}
              >
                <Box className={'search_condition'}>
                  <StyledTextField
                    InputProps={{
                      startAdornment: (
                        <SearchOutlined
                          sx={{ mr: 1, color: 'rgba(0,0,0,.54)' }}
                        />
                      ),
                    }}
                    label={'Property Address'}
                    onChange={(e) => {
                      onParamsChange('propertyAddress', e.target.value);
                      onValueChange(true);
                    }}
                    placeholder={'Property Address'}
                    value={searchForm.propertyAddress}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledSelectMultiple
                    label={'Loan Type'}
                    onValueChange={(e) => {
                      onParamsChange('loanSpecies', e);
                      onValueChange(true);
                    }}
                    options={OPTIONS_LOAN_SPECIES}
                    value={searchForm.loanSpecies}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledSelectMultiple
                    label={'Loan Purpose'}
                    onValueChange={(e) => {
                      onParamsChange('loanPurpose', e);
                      onValueChange(true);
                    }}
                    options={OPTIONS_LOAN_PURPOSE}
                    value={searchForm.loanPurpose}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledDateRange
                    dateRange={searchForm.dateRange}
                    label={'Application Date'}
                    onChange={(date: [Date | null, Date | null]) => {
                      onParamsChange('dateRange', date);
                      onValueChange(true);
                    }}
                    placeholderText={'Application Date'}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledSelectMultiple
                    label={'Stage'}
                    onValueChange={(e) => {
                      onParamsChange('loanStage', e);
                      onValueChange(true);
                    }}
                    options={OPTIONS_LOAN_STAGE}
                    value={searchForm.loanStage}
                  />
                </Box>
              </Stack>
            }
            header={
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                Filter
                <StyledButton isIconButton onClick={close}>
                  <Close />
                </StyledButton>
              </Stack>
            }
            onClose={close}
            open={visible}
            sx={{
              '&.MuiDrawer-root': {
                '& .drawer_header': {
                  position: 'sticky',
                  width: '100%',
                  top: 0,
                  fontWeight: 600,
                  fontSize: 18,
                  color: 'text.primary',
                  borderBottom: '1px solid',
                  borderColor: 'background.border_default',
                  bgcolor: 'background.white',
                  p: 3,
                },
              },
            }}
          />
        </>
      ) : (
        <Stack
          flexDirection={'row'}
          gap={3}
          mt={3}
          sx={{
            '& .search_condition': {
              flex: 1,
              flexShrink: 0,
              width: 'calc(25% - 36px)',
              maxWidth: 'calc(25% - 36px)',
            },
          }}
        >
          <Box className={'search_condition'}>
            <StyledTextField
              InputProps={{
                startAdornment: (
                  <SearchOutlined sx={{ mr: 1, color: 'rgba(0,0,0,.54)' }} />
                ),
              }}
              label={'Property Address'}
              onChange={(e) => {
                onParamsChange('propertyAddress', e.target.value);
                onValueChange(true);
              }}
              placeholder={'Property Address'}
              value={searchForm.propertyAddress}
            />
          </Box>
          <StyledSelectMultiple
            label={'Loan Type'}
            onValueChange={(e) => {
              onParamsChange('loanSpecies', e);
              onValueChange(true);
            }}
            options={OPTIONS_LOAN_SPECIES}
            value={searchForm.loanSpecies}
            sx={{
              flex: 1,
              flexShrink: 0,
              width: 'calc(25% - 36px)',
              maxWidth: 'calc(25% - 36px)',
            }}
          />
          <Box className={'search_condition'}>
            <StyledSelectMultiple
              label={'Loan Purpose'}
              onValueChange={(e) => {
                onParamsChange('loanPurpose', e);
                onValueChange(true);
              }}
              options={OPTIONS_LOAN_PURPOSE}
              value={searchForm.loanPurpose}
            />
          </Box>
          <Box className={'search_condition'}>
            <StyledDateRange
              dateRange={searchForm.dateRange}
              label={'Application Date'}
              onChange={(date: [Date | null, Date | null]) => {
                onParamsChange('dateRange', date);
                onValueChange(true);
              }}
              placeholderText={'Application Date'}
            />
          </Box>
          <Box className={'search_condition'}>
            <StyledSelectMultiple
              label={'Stage'}
              onValueChange={(e) => {
                onParamsChange('loanStage', e);
                onValueChange(true);
              }}
              options={OPTIONS_LOAN_STAGE}
              value={searchForm.loanStage}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
