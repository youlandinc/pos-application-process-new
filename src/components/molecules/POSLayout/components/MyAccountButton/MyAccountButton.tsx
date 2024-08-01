import React, {
  FC,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
} from '@mui/material';
import { ExpandMoreOutlined, PermIdentityOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { useBreakpoints } from '@/hooks';

import { MyAccountButtonProps, MyAccountStyles } from './index';

import { StyledAvatar, StyledButton } from '@/components/atoms';

const MENU_LIST = [
  { label: 'Account', url: '/account' },
  { label: 'Sign out', url: 'sign_out' },
];

export const MyAccountButton: FC<MyAccountButtonProps> = ({ store }) => {
  const [popperVisible, setPopperVisible] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const breakpoint = useBreakpoints();

  const handledClose = useCallback((event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setPopperVisible(false);
  }, []);

  const handledClick = useCallback(() => setPopperVisible((open) => !open), []);

  const handledMenuItemClick = useCallback(
    async (e: MouseEvent<HTMLElement>, url: string) => {
      e.preventDefault();
      if (url === 'sign_out') {
        handledClose(e);
        store.logout();
        return;
      }
      handledClose(e);
      await router.push(url);
    },
    [handledClose, router, store],
  );

  const renderMenuList = useMemo(() => {
    return MENU_LIST.map((item, index) => (
      <MenuItem
        disableRipple
        key={`${item.label}_${index}`}
        onClick={(e) => handledMenuItemClick(e, item.url)}
        sx={{ ...MyAccountStyles.menu_item, justifyContent: 'center' }}
      >
        {item.label}
      </MenuItem>
    ));
  }, [handledMenuItemClick]);

  return (
    <>
      <StyledButton
        color={'info'}
        isIconButton={['sm', 'xs', 'md'].includes(breakpoint)}
        onClick={handledClick}
        ref={anchorRef}
        variant={'outlined'}
      >
        {!['sm', 'xs', 'md'].includes(breakpoint) ? (
          <>
            My account
            <ExpandMoreOutlined
              className={'POS_icon_right'}
              sx={
                popperVisible
                  ? {
                      transform: 'rotate(-.5turn)',
                      transformOrigin: 'center',
                      transition: 'all .3s',
                    }
                  : { transition: 'all .3s' }
              }
            />
          </>
        ) : (
          <PermIdentityOutlined />
        )}
      </StyledButton>
      <Popper
        anchorEl={anchorRef.current}
        disablePortal
        open={popperVisible}
        placement={'bottom'}
        sx={{ position: 'relative', zIndex: 1000 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'top',
            }}
            timeout={popperVisible ? 300 : 0}
          >
            <Paper>
              <ClickAwayListener onClickAway={handledClose}>
                <MenuList sx={{ mt: 2, width: 170, p: 0 }}>
                  <Stack
                    alignItems={'center'}
                    py={1.5}
                    sx={{ cursor: 'default' }}
                  >
                    <StyledAvatar />
                  </Stack>
                  {renderMenuList}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
