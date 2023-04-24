import { useRouter } from 'next/router';
import { FC, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';

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
  const [popperVisible, setPopperVisible] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const handledClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setPopperVisible(false);
  };

  const handledClick = () => setPopperVisible((open) => !open);

  const handledMenuItemClick = useCallback(
    async (e: MouseEvent<HTMLElement>, url: string) => {
      e.preventDefault();
      if (url === 'sign_out') {
        store.logout();
        handledClose(e);
        return;
      }
      await router.push(url);
      handledClose(e);
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
        color={'info'}
        onClick={handledClick}
        ref={anchorRef}
        variant="outlined"
      >
        My Account
        <Icon
          className={'POS_icon_right'}
          component={BUTTON_ICON_ARROW}
          sx={
            popperVisible
              ? {
                  transform: 'rotate(.5turn)',
                  transition: 'all .3s',
                }
              : { transition: 'all .3s' }
          }
        />
      </StyledButton>
      <Popper
        anchorEl={anchorRef.current}
        disablePortal
        open={popperVisible}
        placement="bottom"
        sx={{ position: 'relative', zIndex: 1000 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'top',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handledClose}>
                <MenuList sx={{ mt: 2, width: 170 }}>{renderMenuList}</MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
