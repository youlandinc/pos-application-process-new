import { FC, useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Close, FilterAltOutlined, SearchOutlined } from '@mui/icons-material';

import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  OPTIONS_LOAN_STAGE,
} from '@/constants';
import { UserType } from '@/types';

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

  const renderTitleByRole = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <Typography fontSize={{ xs: 20, lg: 24 }} variant={'h5'}>
            Pipeline{' '}
            <Typography
              color={'primary.main'}
              component={'span'}
              fontSize={{ xs: 16, lg: 20 }}
              variant={'h6'}
            >
              for brokers
            </Typography>
          </Typography>
        );
      case UserType.LOAN_OFFICER:
        return (
          <Typography fontSize={{ xs: 20, lg: 24 }} variant={'h5'}>
            Pipeline{' '}
            <Typography
              color={'primary.main'}
              component={'span'}
              fontSize={{ xs: 16, lg: 20 }}
              variant={'h5'}
            >
              for loan officers
            </Typography>
          </Typography>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <Typography fontSize={{ xs: 20, lg: 24 }} variant={'h5'}>
            Pipeline{' '}
            <Typography
              color={'primary.main'}
              component={'span'}
              fontSize={{ xs: 16, lg: 20 }}
              variant={'h5'}
            >
              for real estate agents
            </Typography>
          </Typography>
        );
      default:
        return (
          <Typography fontSize={{ xs: 20, lg: 24 }} variant={'h5'}>
            My loans
          </Typography>
        );
    }
  }, [userType]);

  return (
    <Stack
      alignItems={{ xs: 'center', xl: 'unset' }}
      flexDirection={{ xs: 'row', xl: 'column' }}
      justifyContent={{ xs: 'space-between', xl: 'unset' }}
    >
      {renderTitleByRole}

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
                    label={'Property address'}
                    onChange={(e) => {
                      onParamsChange('propertyAddress', e.target.value);
                      onValueChange(true);
                    }}
                    placeholder={'Property address'}
                    value={searchForm.propertyAddress}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledSelectMultiple
                    label={'Loan type'}
                    onValueChange={(e) => {
                      onParamsChange('loanSpecies', e);
                      onValueChange(true);
                    }}
                    options={APPLICATION_LOAN_CATEGORY}
                    value={searchForm.loanSpecies}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledSelectMultiple
                    label={'Loan purpose'}
                    onValueChange={(e) => {
                      onParamsChange('loanPurpose', e);
                      onValueChange(true);
                    }}
                    options={APPLICATION_LOAN_PURPOSE}
                    value={searchForm.loanPurpose}
                  />
                </Box>
                <Box className={'search_condition'}>
                  <StyledDateRange
                    dateRange={searchForm.dateRange}
                    label={'Application date'}
                    onChange={(date: [Date | null, Date | null]) => {
                      onParamsChange('dateRange', date);
                      onValueChange(true);
                    }}
                    placeholderText={'Application date'}
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
              label={'Property address'}
              onChange={(e) => {
                onParamsChange('propertyAddress', e.target.value);
                onValueChange(true);
              }}
              placeholder={'Property address'}
              value={searchForm.propertyAddress}
            />
          </Box>
          <StyledSelectMultiple
            label={'Loan type'}
            onValueChange={(e) => {
              onParamsChange('loanSpecies', e);
              onValueChange(true);
            }}
            options={APPLICATION_LOAN_CATEGORY}
            sx={{
              flex: 1,
              flexShrink: 0,
              width: 'calc(25% - 36px)',
              maxWidth: 'calc(25% - 36px)',
            }}
            value={searchForm.loanSpecies}
          />
          <Box className={'search_condition'}>
            <StyledSelectMultiple
              label={'Loan purpose'}
              onValueChange={(e) => {
                onParamsChange('loanPurpose', e);
                onValueChange(true);
              }}
              options={APPLICATION_LOAN_PURPOSE}
              value={searchForm.loanPurpose}
            />
          </Box>
          <Box className={'search_condition'}>
            <StyledDateRange
              dateRange={searchForm.dateRange}
              label={'Application date'}
              onChange={(date: [Date | null, Date | null]) => {
                onParamsChange('dateRange', date);
                onValueChange(true);
              }}
              placeholderText={'Application date'}
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
