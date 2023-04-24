import { usePersistFn, useStoreData, useSwitch } from '@/hooks';
import { FC, useMemo } from 'react';
import { Box, Icon } from '@mui/material';
import { useRouter } from 'next/router';

import { POSHeaderProps, POSHeaderStyles } from './index';
import { MyAccountButton } from '../MyAccountButton';
import { POSFlex } from '@/styles';
import {
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
  Login,
  SignUp,
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
            <StyledButton color={'info'} onClick={open} variant={'text'}>
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
  }, [open, router, scene, store]);

  //const { bindProcess } = useStoreData();
  //
  //const hasSession = useMemo<boolean>(() => !!session, [session]);
  //
  //const hasProcessId = useMemo<boolean>(
  //  () => !!router.query.processId,
  //  [router.query],
  //);
  //
  //const loginSuccess = usePersistFn(() => {
  //  close();
  //  if (initialized && bpmn.owners.length === 0) {
  //    bindProcess();
  //  }
  //  if (!initialized && hasProcessId) {
  //    // If the current URL carries processId and is not initialized, it is likely that there is no permission to access the process of the current processId, then you can directly refresh the webpage after the login is complete, to trigger loadProcess
  //    window.location.reload();
  //  }
  //});

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
        content={<Login isNestForm successCb={close} />}
        onClose={close}
        open={visible}
      />
    </Box>
  );
};
