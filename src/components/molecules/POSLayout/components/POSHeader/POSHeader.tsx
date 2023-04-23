import { FC, useMemo } from 'react';
import { Box, Icon } from '@mui/material';

import { POSHeaderProps, POSHeaderStyles } from './index';
import { MyAccountButton } from '../MyAccountButton';
import { POSFlex } from '@/styles';
import { StyledButton, StyledHeaderLogo } from '@/components';

import BUTTON_ICON_VIEW_ALL_LOANS from '@/svg/button/button_icon_view_all_loans.svg';
import BUTTON_ICON_ADD_NEW_LOAN from '@/svg/button/button_icon_add_new_loan.svg';

export const POSHeader: FC<POSHeaderProps> = ({ store, scene }) => {
  const renderButton = useMemo(() => {
    switch (scene) {
      case 'application':
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              variant={'text'}
            >
              Sign Up
            </StyledButton>
            <StyledButton color={'info'} variant={'text'}>
              Log In
            </StyledButton>
          </Box>
        );
      case 'dashboard':
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              variant={'outlined'}
            >
              <Icon
                className={'POS_icon_left'}
                component={BUTTON_ICON_VIEW_ALL_LOANS}
              />
              View All Loans
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );
      case 'pipeline':
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              variant={'outlined'}
            >
              <Icon
                className={'POS_icon_left'}
                component={BUTTON_ICON_ADD_NEW_LOAN}
              />
              Start New Loan
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );
    }
  }, [scene]);

  return (
    <Box
      sx={{
        ...POSFlex('center', 'center', 'row'),
      }}
    >
      <Box
        sx={{
          ...POSFlex('center', 'flex-start', 'row'),
          height: 92,
          width: {
            xxl: 1440,
            xl: 1240,
            lg: 938,
            xs: '100%',
          },
          px: {
            lg: 0,
            xs: 'clamp(24px,6.4vw,80px)',
          },
        }}
      >
        <StyledHeaderLogo />
        <Box sx={{ ml: 'auto' }}>{renderButton}</Box>
      </Box>
    </Box>
  );
};
