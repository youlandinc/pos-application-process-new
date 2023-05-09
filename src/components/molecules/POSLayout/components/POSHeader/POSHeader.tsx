import Link from 'next/link';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import {
  CloseOutlined,
  DehazeOutlined,
  PostAddOutlined,
  WidgetsOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { POSHeaderProps, POSHeaderStyles } from './index';
import { MyAccountButton } from '../MyAccountButton';
import { POSFlex } from '@/styles';
import { useBreakpoints, usePersistFn, useStoreData, useSwitch } from '@/hooks';
import {
  ForgotPassword,
  Login,
  SideDrawer,
  SignUp,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
} from '@/components';

export const POSHeader: FC<POSHeaderProps> = observer(({ store, scene }) => {
  const router = useRouter();

  const { bindProcess } = useStoreData();
  const { visible, open, close } = useSwitch(false);
  const {
    visible: closeVisible,
    open: sideOpen,
    close: sideClose,
  } = useSwitch();
  const breakpoint = useBreakpoints();

  const {
    session,
    bpmn,
    applicationForm: { initialized },
    userType,
    userSetting: { pipelineStatus, pipelineStatusInitialized },
  } = store;

  const [authType, setAuthType] = useState<
    'login' | 'sign_up' | 'reset_password'
  >('login');
  const [target, setTarget] = useState<'_top' | '_blank'>('_top');

  const hasSession = useMemo<boolean>(() => !!session, [session]);

  const hasProcessId = useMemo<boolean>(
    () => !!router.query.processId,
    [router.query],
  );

  useEffect(() => {
    setTarget('_blank');
  }, []);

  const handledLoginSuccess = usePersistFn(() => {
    close();
    if (
      initialized &&
      (bpmn.owners as Array<{ userId: string }>).length === 0
    ) {
      bindProcess();
    }
    if (!initialized && hasProcessId) {
      // If the current URL carries processId and is not initialized, it is likely that there is no permission to access the process of the current processId, then you can directly refresh the webpage after the login is complete, to trigger loadProcess
      window.location.reload();
    }
  });

  const handledSignUpAndResetSuccess = usePersistFn(() => {
    close();
    setAuthType('login');
  });

  const handledClose = useCallback(
    (
      e: MouseEvent,
      reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
      if (reason !== 'backdropClick') {
        close();
      }
    },
    [close],
  );

  const renderButton = useMemo(() => {
    switch (scene) {
      case 'application':
        return !hasSession ? (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              onClick={() => {
                setAuthType('sign_up');
                open();
              }}
              variant={'text'}
            >
              Sign Up
            </StyledButton>
            <StyledButton
              color={'info'}
              onClick={() => {
                setAuthType('login');
                open();
              }}
              variant={'text'}
            >
              Log In
            </StyledButton>
          </Box>
        ) : (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              variant={'outlined'}
            >
              <WidgetsOutlined
                className={
                  !['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'POS_icon_left'
                    : ''
                }
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View All Loans'}
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );
      case 'dashboard':
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              variant={'outlined'}
            >
              <WidgetsOutlined
                className={
                  !['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'POS_icon_left'
                    : ''
                }
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View All Loans'}
            </StyledButton>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/')}
              variant={'outlined'}
            >
              <PostAddOutlined
                className={
                  !['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'POS_icon_left'
                    : ''
                }
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start New Loan'}
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
              disabled={!pipelineStatus}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              variant={'outlined'}
            >
              <WidgetsOutlined
                className={
                  !['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'POS_icon_left'
                    : ''
                }
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View All Loans'}
            </StyledButton>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              disabled={!pipelineStatus}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/')}
              variant={'outlined'}
            >
              <PostAddOutlined
                className={
                  !['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'POS_icon_left'
                    : ''
                }
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start New Loan'}
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );
    }
  }, [breakpoint, hasSession, open, pipelineStatus, router, scene, store]);

  const renderDialog = useMemo(() => {
    switch (authType) {
      case 'login':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Welcome to YouLand!</Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: <Login isNestForm successCb={handledLoginSuccess} />,
          footer: (
            <Box
              className={
                'POS_flex POS_jc_sb POS_al_c POS_fd_row POS_mt_3 POS_fullwidth'
              }
              sx={{
                justifyContent: { md: 'space-between', xs: 'center' },
                flexDirection: { md: 'row', xs: 'column' },
              }}
            >
              <Typography variant={'body2'}>
                Don&apos;t have an account?{' '}
                <Typography
                  className={'link_style'}
                  component={'span'}
                  onClick={() => setAuthType('sign_up')}
                  variant={'body2'}
                >
                  Sign Up
                </Typography>
              </Typography>
              <Typography
                className={'link_style'}
                color={'primary'}
                onClick={() => setAuthType('reset_password')}
                variant={'body2'}
              >
                Forgot Password?
              </Typography>
            </Box>
          ),
        };

      case 'reset_password':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Reset Password</Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: (
            <ForgotPassword
              isNestForm
              isRedirect={false}
              successCb={handledSignUpAndResetSuccess}
            />
          ),
          footer: (
            <Typography
              className={'link_style POS_mt_3'}
              color={'info'}
              onClick={() => setAuthType('login')}
              variant={'body2'}
            >
              Back to Log In
            </Typography>
          ),
        };

      case 'sign_up':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Sign Up</Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: (
            <SignUp
              isNestForm
              isRedirect={false}
              successCb={handledSignUpAndResetSuccess}
            />
          ),
          footer: (
            <Box className="POS_tc POS_mt_3">
              <Typography component={'div'} variant={'body2'}>
                Already have an account?{' '}
                <Typography
                  className={'link_style'}
                  component={'span'}
                  onClick={() => setAuthType('login')}
                  variant={'body2'}
                >
                  Log In
                </Typography>
              </Typography>
              <Typography sx={{ color: 'info.main', mt: 3 }} variant={'body2'}>
                By signing up, you agree to our{' '}
                <Link
                  className="link_style"
                  href={'https://www.youland.com/legal/terms/'}
                  target={target}
                >
                  Term of Use{' '}
                </Link>
                and to receive YouLand emails & updates and acknowledge that you
                read our{' '}
                <Link
                  className="link_style"
                  href={'https://www.youland.com/legal/privacy/'}
                  target={target}
                >
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          ),
        };
    }
  }, [
    authType,
    close,
    handledLoginSuccess,
    handledSignUpAndResetSuccess,
    target,
  ]);

  return (
    <Box
      sx={{
        ...POSFlex('center', 'center', 'row'),
      }}
    >
      <Box sx={POSHeaderStyles}>
        {scene === 'dashboard' ? (
          ['xs', 'sm', 'md'].includes(breakpoint) ? (
            <StyledButton isIconButton onClick={sideOpen}>
              <DehazeOutlined />
            </StyledButton>
          ) : (
            <StyledHeaderLogo />
          )
        ) : (
          <StyledHeaderLogo />
        )}
        <Box sx={{ ml: 'auto' }}>{renderButton}</Box>
      </Box>
      <SideDrawer close={sideClose} visible={closeVisible} />
      <StyledDialog
        content={renderDialog.content}
        disableEscapeKeyDown
        footer={renderDialog.footer}
        header={renderDialog.header}
        onClose={handledClose}
        open={visible}
      />
    </Box>
  );
});
