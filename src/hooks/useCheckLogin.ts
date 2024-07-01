import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { useMst } from '@/models/Root';

import { usePersistFn } from './index';
import { AUTO_HIDE_DURATION } from '@/constants';
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
    return router.push(jumpPath);
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
      // if (logoutNotification) {
      //   enqueueSnackbar("You haven't logged", {
      //     variant: 'error',
      //     autoHideDuration: AUTO_HIDE_DURATION,
      //   });
      // }
      if (
        router.pathname === jumpPath ||
        router.pathname === '/' ||
        router.pathname.includes('estimate-rate') ||
        router.pathname.includes('auth-page')
      ) {
        return;
      }
      return router.push(jumpPath);
    }

    try {
      const {
        data: { forceChangePassword },
      } = await _fetchUserInfo();
      if (forceChangePassword) {
        return router.push('/auth/reset-password');
      }
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
