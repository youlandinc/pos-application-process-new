import { StyledButton } from '@/components';
import { userpool } from '@/constants';

import { useBreakpoints } from '@/hooks';
import { UserType } from '@/types';
import { ExpandMoreOutlined, PermIdentityOutlined } from '@mui/icons-material';
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  FC,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MyAccountButtonProps, MyAccountStyles } from './index';

const MENU_LIST_CUSTOMER = [
  { label: 'Change Email', url: '/auth/change_email' },
  {
    label: 'Change Password',
    url: '/auth/change_password',
  },
  { label: 'Sign Out', url: 'sign_out' },
];

const MENU_LIST_NOT_CUSTOMER = [
  { label: 'My Profile', url: '/pipeline/profile' },
  { label: 'Change Email', url: '/auth/change_email' },
  {
    label: 'Change Password',
    url: '/auth/change_password',
  },
  { label: 'Sign Out', url: 'sign_out' },
];

export const MyAccountButton: FC<MyAccountButtonProps> = ({ scene, store }) => {
  const userType = userpool.getLastAuthUserInfo(
    userpool.getLastAuthUserId(),
    'user_type',
  );

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
        store.logout();
        handledClose(e);
        return;
      }
      await router.push(url);
      handledClose(e);
    },
    [handledClose, router, store],
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
        if (userType === UserType.CUSTOMER) {
          return MENU_LIST_CUSTOMER.map((item, index) => (
            <MenuItem
              key={`${item.label}_${index}`}
              onClick={(e) => handledMenuItemClick(e, item.url)}
              sx={MyAccountStyles.menu_item}
            >
              {item.label}
            </MenuItem>
          ));
        }
        return MENU_LIST_NOT_CUSTOMER.map((item, index) => (
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
  }, [handledMenuItemClick, scene, userType]);

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
            My Account
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
