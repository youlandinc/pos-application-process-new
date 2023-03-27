import { useMst } from '@/models/Root';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { usePersistFn } from '@/hooks/usePersistFn';
import { useCallback, useEffect } from 'react';
import { UserType } from '@/types/enum';
import { AUTO_HIDE_DURATION } from '@/constants';

export const useCheckHasLoggedIn = (
  jumpPath = '/my_application/application',
) => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = usePersistFn(() => {
    if (!persistDataLoaded || session === void 0 || !userType || !loginType)
      return;
    enqueueSnackbar('You have logged in and are now ready for you', {
      variant: 'success',
      autoHideDuration: AUTO_HIDE_DURATION,
      onClose: () => {
        router.push(jumpPath);
      },
    });
  });
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

export const useCheckIsLogin = (jumpPath = '/auth/sign_in') => {
  const { session, persistDataLoaded, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = usePersistFn(() => {
    if (
      !persistDataLoaded ||
      (session && userType && loginType) ||
      router.pathname === jumpPath
    ) {
      return;
    }
    router.push(jumpPath);
    enqueueSnackbar("You haven't logged", {
      variant: 'error',
      autoHideDuration: AUTO_HIDE_DURATION,
    });
  });

  // only detecting at the first time entry
  useEffect(() => {
    check();
  }, [check, persistDataLoaded]);
};

//export const useCheckBrokerIsApproval = (jumpPath = '/my_application/task') => {
//  const { session, persistDataLoaded, userType, loginType } = useMst();
//  const { enqueueSnackbar } = useSnackbar();
//  const router = useRouter();
//  const check = useCallback(async () => {
//    if (
//      !persistDataLoaded ||
//      (session && userType && loginType && brokerStatus) ||
//      router.pathname.includes('my_application/task') ||
//      router.pathname.includes('change_email') ||
//      router.pathname.includes('change_password')
//    ) {
//      return;
//    }
//    if (session) {
//      await fetchBrokerStatus();
//      if (
//        brokerStatusInitialized &&
//        !brokerStatus &&
//        userType === UserType.BROKER
//      ) {
//        await router.push(jumpPath);
//        enqueueSnackbar('Your broker application hasn’t been approved', {
//          variant: 'error',
//          autoHideDuration: AUTO_HIDE_DURATION,
//        });
//      }
//    }
//  }, [
//    brokerStatus,
//    brokerStatusInitialized,
//    enqueueSnackbar,
//    fetchBrokerStatus,
//    jumpPath,
//    loginType,
//    persistDataLoaded,
//    router,
//    session,
//    userType,
//  ]);
//
//  useEffect(() => {
//    check();
//  }, [check]);
//};
