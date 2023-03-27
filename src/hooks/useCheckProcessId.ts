import { useMst } from '@/models/Root';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
//import { usePersistFn } from '@/hooks/usePersistFn';
import { useCallback, useEffect } from 'react';
import { UserType } from '@/types/enum';
import { AUTO_HIDE_DURATION } from '@/constants';

export const useCheckProcessId = (jumpPath = '/my_application/application') => {
  const { userSetting, userType, loginType } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const check = useCallback(() => {
    if (userType === UserType.BROKER) {
      router.push(jumpPath);
      return;
    }
    if (userSetting.setting.lastSelectedProcessId === '') {
      enqueueSnackbar('Please select a loan application first', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        onClose: () => {
          router.push(jumpPath);
        },
      });
      return;
    }
  }, [
    enqueueSnackbar,
    jumpPath,
    router,
    userSetting.setting.lastSelectedProcessId,
    userType,
  ]);

  useEffect(() => {
    check();
  }, [check]);
};
