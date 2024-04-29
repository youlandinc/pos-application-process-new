import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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
import {
  useBreakpoints,
  usePersistFn,
  useSessionStorageState,
  useStoreData,
  useSwitch,
} from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
} from '@/components/atoms';
import {
  DashboardSideDrawer,
  ForgotPassword,
  Login,
  SignUp,
} from '@/components/molecules';
import { POSFormatUrl } from '@/utils';
import { LoanSnapshotEnum } from '@/types';

export const POSHeader: FC<POSHeaderProps> = observer(({ store, scene }) => {
  const router = useRouter();

  const { bindLoan } = useStoreData();
  const { visible, open, close } = useSwitch(false);
  const {
    visible: closeVisible,
    open: sideOpen,
    close: sideClose,
  } = useSwitch();
  const { saasState } = useSessionStorageState('tenantConfig');
  const breakpoint = useBreakpoints();

  const { session, applicationForm } = store;

  const [authType, setAuthType] = useState<
    'login' | 'sign_up' | 'reset_password'
  >('login');

  const hasSession = useMemo<boolean>(() => !!session, [session]);

  const handledLoginSuccess = usePersistFn(() => {
    close();
    //  if (!router.query.loanId || applicationForm.loading) {
    //    return;
    //  }
    //  if (!applicationForm.isBind) {
    //    bindLoan({ loanId: router.query.loanId });
    //  }
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
          applicationForm.snapshot !== LoanSnapshotEnum.auth_page && (
            <Box>
              <StyledButton
                color={'info'}
                onClick={() => {
                  setAuthType('sign_up');
                  open();
                }}
                size={'small'}
                sx={{
                  '&.MuiButton-sizeSmall': {
                    p: { md: '7px 14px', xs: '0' },
                    fontSize: 14,
                    width: 'fit-content',
                    mr: 3,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  },
                }}
                variant={'text'}
              >
                Sign up
              </StyledButton>
              <StyledButton
                color={'info'}
                onClick={() => {
                  setAuthType('login');
                  open();
                }}
                size={'small'}
                sx={{
                  '&.MuiButton-sizeSmall': {
                    p: { md: '7px 14px', xs: '0' },
                    fontSize: 14,
                    width: 'fit-content',
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  },
                }}
                variant={'text'}
              >
                Log in
              </StyledButton>
            </Box>
          )
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
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
              //disabled={!applicable}
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
            </StyledButton>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              //disabled={!applicable}
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );

      case 'pipeline_without_all': {
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              //disabled={!applicable}
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
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
            </StyledButton>
            <MyAccountButton scene={scene} store={store} />
          </Box>
        );
      }
    }
  }, [
    scene,
    hasSession,
    applicationForm.snapshot,
    breakpoint,
    store,
    open,
    router,
  ]);

  const renderDialog = useMemo(() => {
    switch (authType) {
      case 'login':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>
                Log in to {saasState?.organizationName || 'YouLand'}
              </Typography>
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
                  component={'span'}
                  onClick={() => setAuthType('sign_up')}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Sign up
                </Typography>
              </Typography>
              <Typography
                color={'primary'}
                onClick={() => setAuthType('reset_password')}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                variant={'body2'}
              >
                Forgot password?
              </Typography>
            </Box>
          ),
        };

      case 'reset_password':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Reset password</Typography>
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
              color={'info'}
              mt={3}
              onClick={() => setAuthType('login')}
              sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
              variant={'body2'}
            >
              Back to Log in
            </Typography>
          ),
        };

      case 'sign_up':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Sign up</Typography>
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
                  component={'span'}
                  onClick={() => setAuthType('login')}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Log in
                </Typography>
              </Typography>
              <Typography sx={{ color: 'info.main', mt: 3 }} variant={'body2'}>
                By signing up, you agree to our{' '}
                <Typography
                  component={'span'}
                  onClick={() =>
                    window.open(
                      POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                        'https://www.youland.com/legal/terms/',
                    )
                  }
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Term of Use{' '}
                </Typography>
                and to receive
                {' ' + saasState?.organizationName || ' YouLand'} emails &
                updates and acknowledge that you read our{' '}
                <Typography
                  component={'span'}
                  onClick={() =>
                    window.open(
                      POSFormatUrl(
                        saasState?.legalAgreements?.privacyPolicyUrl,
                      ) || 'https://www.youland.com/legal/privacy/',
                    )
                  }
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Privacy Policy
                </Typography>
                .
              </Typography>
            </Box>
          ),
        };
    }
  }, [
    authType,
    close,
    //handledLoginSuccess,
    handledSignUpAndResetSuccess,
    saasState?.legalAgreements?.privacyPolicyUrl,
    saasState?.legalAgreements?.termsUrl,
    saasState?.organizationName,
  ]);

  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'center'}
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
      {/*<DashboardSideDrawer close={sideClose} visible={closeVisible} />*/}
      <StyledDialog
        content={renderDialog.content}
        disableEscapeKeyDown
        footer={renderDialog.footer}
        header={renderDialog.header}
        onClose={handledClose}
        open={visible}
        scroll={'body'}
      />
    </Stack>
  );
});
