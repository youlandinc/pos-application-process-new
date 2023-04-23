import { useRouter } from 'next/router';
import { FC, MouseEvent, useCallback, useMemo, useState } from 'react';
import { Fade, Icon, Menu, MenuItem } from '@mui/material';

import { MyAccountButtonProps, MyAccountStyles } from './index';
import { StyledButton } from '@/components';

import BUTTON_ICON_ARROW from '@/svg/button/button_icon_arrow.svg';

const MENU_LIST = [
  { label: 'My Profile', url: '' },
  { label: 'Change Email', url: '' },
  {
    label: 'Change Password',
    url: '',
  },
  { label: 'Sign Out', url: 'sign_out' },
];

export const MyAccountButton: FC<MyAccountButtonProps> = ({ scene, store }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();
  const handledClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handledClose = () => {
    setAnchorEl(null);
  };

  const handledMenuItemClick = useCallback(
    async (e: MouseEvent<HTMLElement>, url: string) => {
      e.preventDefault();
      if (url === 'sign_out') {
        store.logout();
        handledClose();
        return;
      }
      await router.push(url);
      handledClose();
    },
    [router, store],
  );

  const renderMenuList = useMemo(() => {
    switch (scene) {
      case 'application':
        return (
          <MenuItem
            onClick={(e) => handledMenuItemClick(e, 'sign_out')}
            sx={MyAccountStyles.menu_item}
          >
            Sign Out
          </MenuItem>
        );
      case 'dashboard':
      case 'pipeline':
        return MENU_LIST.map((item, index) => (
          <MenuItem
            key={`${item.label}_${index}`}
            onClick={(e) => handledMenuItemClick(e, item.url)}
            sx={MyAccountStyles.menu_item}
          >
            {item.label}
          </MenuItem>
        ));
      default:
        return (
          <MenuItem
            onClick={(e) => handledMenuItemClick(e, 'sign_out')}
            sx={MyAccountStyles.menu_item}
          >
            Sign Out
          </MenuItem>
        );
    }
  }, [handledMenuItemClick, scene]);

  return (
    <>
      <StyledButton
        aria-controls={open ? 'POS_CUSTOM_MY_ACCOUNT_MENU' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color={'info'}
        disableElevation
        id="POS_CUSTOM_MY_ACCOUNT_BUTTON"
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
        id="POS_CUSTOM_MY_ACCOUNT_MENU"
        MenuListProps={{
          'aria-labelledby': 'POS_CUSTOM_MY_ACCOUNT_BUTTON',
        }}
        onClose={handledClose}
        open={open}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        {renderMenuList}
      </Menu>
    </>
  );
};
