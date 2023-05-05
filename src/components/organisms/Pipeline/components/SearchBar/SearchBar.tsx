import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Close, FilterAltOutlined, SearchOutlined } from '@mui/icons-material';

import { OPTIONS_LOAN_SPECIES, OPTIONS_LOAN_STAGE } from '@/constants';

import { useBreakpoints, useSwitch } from '@/hooks';
import {
  StyledButton,
  StyledDateRange,
  StyledDrawer,
  StyledSelectMultiple,
  StyledTextField,
} from '@/components';

export interface SearchBarProps {
  searchForm: {
    propertyAddress: string;
    loanStage: string[];
    loanSpecies: string[];
    dateRange: [Date | null, Date | null];
  };
  onParamsChange: (
    k: keyof SearchBarProps['searchForm'],
    v: string | string[] | [Date | null, Date | null] | boolean,
  ) => void;
  onValueChange: (v: boolean) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchForm,
  onParamsChange,
  onValueChange,
}) => {
  const breakpoint = useBreakpoints();

  const { visible, open, close } = useSwitch(false);

  return (
    <Stack
      alignItems={{ xs: 'center', lg: 'unset' }}
      flexDirection={{ xs: 'row', lg: 'column' }}
      justifyContent={{ xs: 'space-between', lg: 'unset' }}
    >
      <Typography variant={'h4'}>Pipeline</Typography>
      {['xs', 'sm', 'md'].includes(breakpoint) ? (
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
