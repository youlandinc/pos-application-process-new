import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';

export const useCheckProcessId = (jumpPath = '/pipeline') => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const check = useCallback(() => {
    if (!location.href.includes('loanId')) {
      enqueueSnackbar('Please select a loan application first', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        onClose: async () => {
          await router.push(jumpPath);
        },
      });
      return;
    }
  }, [enqueueSnackbar, jumpPath, router]);

  useEffect(() => {
    check();
  }, [check]);
};
