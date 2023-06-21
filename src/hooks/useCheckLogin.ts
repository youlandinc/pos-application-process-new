import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { useMst } from '@/models/Root';

import { usePersistFn } from './index';
import { AUTO_HIDE_DURATION } from '@/constants';
import { UserType } from '@/types';

export const useCheckHasLoggedIn = (jumpPath = '/pipeline') => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = usePersistFn(() => {
    if (!persistDataLoaded || session === void 0 || !userType || !loginType) {
      return;
    }
    enqueueSnackbar('You have logged in and are now ready for you', {
      variant: 'success',
      autoHideDuration: AUTO_HIDE_DURATION,
    });
    router.push(jumpPath);
  });
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

export const useCheckIsLogin = (jumpPath = '/auth/login') => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = usePersistFn(() => {
    if (router.pathname.includes('application')) {
      return;
    }
    if (
      !persistDataLoaded ||
      (session && userType && loginType) ||
      router.pathname === jumpPath
    ) {
      return;
    }
    router.push(jumpPath);
    if (
      !router.pathname.includes('pipeline') &&
      router.pathname.includes('application')
    ) {
      enqueueSnackbar("You haven't logged", {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  });

  // only detecting at the first time entry
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

export const useCheckInfoIsComplete = (jumpPath = '/pipeline/profile') => {
  const {
    session,
    persistDataLoaded,
    userType,
    loginType,
    userSetting: {
      pipelineStatusInitialized,
      pipelineStatus,
      fetchPipelineStatus,
    },
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = useCallback(async () => {
    if (
      !persistDataLoaded ||
      (session && userType && loginType && pipelineStatus) ||
      router.pathname.includes('/pipeline/profile') ||
      router.pathname.includes('/pipeline/task') ||
      router.pathname.includes('/change_email') ||
      router.pathname.includes('/change_password')
    ) {
      return;
    }
    if (session) {
      await fetchPipelineStatus();
      if (
        pipelineStatusInitialized &&
        !pipelineStatus &&
        userType !== UserType.CUSTOMER
      ) {
        await router.push(jumpPath);
        enqueueSnackbar('Your information is incomplete', {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    }
  }, [
    enqueueSnackbar,
    fetchPipelineStatus,
    jumpPath,
    loginType,
    persistDataLoaded,
    pipelineStatus,
    pipelineStatusInitialized,
    router,
    session,
    userType,
  ]);

  useEffect(() => {
    check();
  }, [check]);
};
