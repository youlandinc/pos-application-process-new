import { FC, MouseEvent, useState } from 'react';
import { Fade, Icon, Menu, MenuItem } from '@mui/material';

import { StyledButton } from '@/components';

import BUTTON_ICON_ARROW from '@/svg/button/button_icon_arrow.svg';

export const MyAccountButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handledClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handledClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color={'info'}
        disableElevation
        id="POS_CUSTOME_MY_ACCOUNT_BUTTON"
        onClick={handledClick}
        variant="outlined"
      >
        My Account
        <Icon
          className={'POS_icon_right'}
          component={BUTTON_ICON_ARROW}
          sx={
            open
              ? {
                  transform: 'rotate(.5turn)',
                  transition: 'all .3s',
                }
              : { transition: 'all .3s' }
          }
        />
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'POS_CUSTOME_MY_ACCOUNT_BUTTON',
        }}
        onClose={handledClose}
        open={open}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handledClose}>Profile</MenuItem>
        <MenuItem onClick={handledClose}>My account</MenuItem>
        <MenuItem onClick={handledClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};
