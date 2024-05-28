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

import { userpool } from '@/constants';

import { LayoutSceneTypeEnum, UserType } from '@/types';
import { MyAccountButtonProps, MyAccountStyles } from './index';

import { StyledAvatarUploadRef, StyledButton } from '@/components/atoms';

const hash = {
  [UserType.LOAN_OFFICER]: 'Loan officer',
  [UserType.BROKER]: 'Broker',
  [UserType.LENDER]: 'Lender',
  [UserType.REAL_ESTATE_AGENT]: 'Agent',
  [UserType.CUSTOMER]: 'Customer',
};

const MENU_LIST = [
  { label: 'Account', url: '/account' },
  { label: 'Sign out', url: 'sign_out' },
];

export const MyAccountButton: FC<MyAccountButtonProps> = ({ store }) => {
  const lastAuthUserId = userpool.getLastAuthUserId();

  const avatar = userpool.getLastAuthUserInfo(lastAuthUserId, 'avatar');
  const backgroundColor = userpool.getLastAuthUserInfo(
    lastAuthUserId,
    'background',
  );

  const computedName = useMemo(() => {
    const firstName = userpool
      .getLastAuthUserInfo(lastAuthUserId, 'firstName')
      ?.charAt(0)
      .toUpperCase();
    const lastName = userpool
      .getLastAuthUserInfo(lastAuthUserId, 'lastName')
      ?.charAt(0)
      .toUpperCase();
    if (!firstName && !lastName) {
      return false;
    }
    return `${firstName}${lastName}`;
  }, [lastAuthUserId]);

  const [popperVisible, setPopperVisible] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const avatarRef = useRef<StyledAvatarUploadRef>(null);

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
      if (url === 'change_avatar') {
        avatarRef.current?.open();
        return;
      }
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
                    {avatar ? (
                      <picture
                        style={{
                          display: 'block',
                          position: 'relative',
                          height: 48,
                          width: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          alt=""
                          src={avatar}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </picture>
                    ) : computedName ? (
                      <Stack
                        alignItems={'center'}
                        borderRadius={'50%'}
                        color={'#ffffff'}
                        fontSize={16}
                        fontWeight={600}
                        height={48}
                        justifyContent={'center'}
                        pt={0.25}
                        sx={{ background: backgroundColor }}
                        width={48}
                      >
                        {computedName}
                      </Stack>
                    ) : (
                      <picture
                        style={{
                          display: 'block',
                          position: 'relative',
                          height: 48,
                          width: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '1px solid #D2D6E1',
                        }}
                      >
                        <img
                          alt=""
                          src={'/images/placeholder_avatar.png'}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </picture>
                    )}
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
