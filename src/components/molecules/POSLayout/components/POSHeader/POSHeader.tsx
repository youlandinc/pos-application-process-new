import { usePersistFn, useStoreData, useSwitch } from '@/hooks';
import { FC, useMemo, useState } from 'react';
import { Box, Icon } from '@mui/material';
import { useRouter } from 'next/router';

import { POSHeaderProps, POSHeaderStyles } from './index';
import { MyAccountButton } from '../MyAccountButton';
import { POSFlex } from '@/styles';
import {
  Login,
  SignUp,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
} from '@/components';

import BUTTON_ICON_VIEW_ALL_LOANS from '@/svg/button/button_icon_view_all_loans.svg';
import BUTTON_ICON_ADD_NEW_LOAN from '@/svg/button/button_icon_add_new_loan.svg';

export const POSHeader: FC<POSHeaderProps> = ({ store, scene }) => {
  const router = useRouter();

  const {
    session,
    bpmn,
    applicationForm: { initialized },
    userType,
    userSetting: { pipelineStatus, pipelineStatusInitialized },
  } = store;

  const { visible, open, close } = useSwitch(false);

  const { bindProcess } = useStoreData();

  const [authType, setAuthType] = useState<'login' | 'sign_up' | ''>('');

  const hasSession = useMemo<boolean>(() => !!session, [session]);

  const hasProcessId = useMemo<boolean>(
    () => !!router.query.processId,
    [router.query],
  );

  const loginSuccess = usePersistFn(() => {
    close();
    if (initialized && bpmn.owners.length === 0) {
      bindProcess();
    }
    if (!initialized && hasProcessId) {
      // If the current URL carries processId and is not initialized, it is likely that there is no permission to access the process of the current processId, then you can directly refresh the webpage after the login is complete, to trigger loadProcess
      window.location.reload();
    }
  });

  const renderButton = useMemo(() => {
    switch (scene) {
      case 'application':
        return hasSession ? (
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
              onClick={() => router.push('/pipeline')}
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
      case 'dashboard':
        return (
          <Box>
            <StyledButton
              className={'POS_mr_3'}
              color={'info'}
              onClick={() => router.push('/pipeline')}
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
              onClick={() => router.push('/')}
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
  }, [hasSession, open, router, scene, store]);

  return (
    <Box
      sx={{
        ...POSFlex('center', 'center', 'row'),
      }}
    >
      <Box sx={POSHeaderStyles}>
        <StyledHeaderLogo />
        <Box sx={{ ml: 'auto' }}>{renderButton}</Box>
      </Box>
      <StyledDialog
        content={
          authType === 'sign_up' ? (
            <SignUp isNestForm />
          ) : (
            <Login isNestForm successCb={loginSuccess} />
          )
        }
        onClose={close}
        open={visible}
      />
    </Box>
  );
};
