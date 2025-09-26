import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { useMst } from '@/models/Root';

import { usePersistFn } from './index';
import { AUTO_HIDE_DURATION, userpool } from '@/constants';
import { _fetchUserInfo } from '@/requests';
import { HttpError } from '@/types';
// import { LoanSnapshotEnum } from '@/types';

export const useCheckHasLoggedIn = (jumpPath = '/pipeline') => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = usePersistFn(() => {
    if (!persistDataLoaded || session === void 0 || !userType || !loginType) {
      return;
    }
    enqueueSnackbar('You have successfully logged in', {
      variant: 'success',
      autoHideDuration: AUTO_HIDE_DURATION,
    });
    return router.push({ pathname: jumpPath, query: router.query });
  });
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

export const useCheckIsLogin = (jumpPath = '/auth/login') => {
  const {
    session,
    // logoutNotification
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const check = usePersistFn(async () => {
    if (!session) {
      if (
        router.pathname === jumpPath ||
        router.pathname === '/' ||
        router.pathname.includes('estimate-rate') ||
        router.pathname.includes('auth-page') ||
        router.pathname.includes('loan-information') ||
        router.pathname.includes('submit-lead') ||
        router.pathname.includes('submit-lead-success') ||
        router.pathname.includes('land-readiness')
      ) {
        return;
      }
      return router.push({ pathname: jumpPath, query: router.query });
    }

    try {
      const {
        data: {
          forceChangePassword,
          userInfo: { avatar, firstName, lastName, backgroundColor },
        },
      } = await _fetchUserInfo();
      if (forceChangePassword) {
        return router.push('/auth/reset-password');
      }
      const lastAuthId = userpool.getLastAuthUserId();

      userpool.setLastAuthUserInfo(lastAuthId, 'avatar', avatar ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName ?? '');
      userpool.setLastAuthUserInfo(
        lastAuthId,
        'background',
        backgroundColor ?? '',
      );
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  });

  // only detecting at the first time entry
  useEffect(() => {
    check();
  }, [check, session]);
};

export const useCheckOffMarketLogIn = (jumpPath = '/off-market-deals') => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const check = usePersistFn(() => {
    if (!persistDataLoaded || session === void 0 || !userType || !loginType) {
      return;
    }
    enqueueSnackbar('You have successfully logged in', {
      variant: 'success',
      autoHideDuration: AUTO_HIDE_DURATION,
    });
    return router.push({ pathname: jumpPath });
  });
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

export const useCheckOffMarketIsLogin = (jumpPath = '/off-market/login') => {
  const { session } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const check = usePersistFn(async () => {
    if (!session) {
      return router.push({ pathname: jumpPath });
    }

    try {
      const {
        data: {
          forceChangePassword,
          userInfo: { avatar, firstName, lastName, backgroundColor },
        },
      } = await _fetchUserInfo();
      if (forceChangePassword) {
        return router.push('/off-market/reset-password');
      }
      const lastAuthId = userpool.getLastAuthUserId();

      userpool.setLastAuthUserInfo(lastAuthId, 'avatar', avatar ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName ?? '');
      userpool.setLastAuthUserInfo(
        lastAuthId,
        'background',
        backgroundColor ?? '',
      );
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  });

  // only detecting at the first time entry
  useEffect(() => {
    check();
  }, [check, session]);
};

// export const useCheckInfoIsComplete = (jumpPath = '/pipeline/profile') => {
//   const {
//     session,
//     persistDataLoaded,
//     userType,
//     loginType,
//     userSetting: { pipelineStatusInitialized, fetchPipelineStatus, applicable },
//   } = useMst();
//
//   const { enqueueSnackbar } = useSnackbar();
//   const router = useRouter();
//   const check = useCallback(async () => {
//     if (
//       !persistDataLoaded ||
//       (!session && !userType && !loginType && !applicable) ||
//       router.pathname.includes('/pipeline/profile') ||
//       router.pathname.includes('/pipeline/task') ||
//       router.pathname.includes('/change_email') ||
//       router.pathname.includes('/change_password')
//     ) {
//       return;
//     }
//     if (session) {
//       await fetchPipelineStatus();
//       if (
//         pipelineStatusInitialized &&
//         userType !== UserType.CUSTOMER &&
//         !applicable
//       ) {
//         await router.push(jumpPath);
//         enqueueSnackbar('Your information is incomplete', {
//           variant: 'error',
//           autoHideDuration: AUTO_HIDE_DURATION,
//         });
//       }
//     }
//   }, [
//     applicable,
//     enqueueSnackbar,
//     fetchPipelineStatus,
//     jumpPath,
//     loginType,
//     persistDataLoaded,
//     pipelineStatusInitialized,
//     router,
//     session,
//     userType,
//   ]);
//
//   useEffect(() => {
//     check();
//   }, [check]);
// };
