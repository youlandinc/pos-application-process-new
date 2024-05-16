import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { HttpError } from '@/types';
import { AUTO_HIDE_DURATION, URL_HASH } from '@/constants';

import { _bindLoan, _redirectLoan, _updateLoan } from '@/requests/application';
import { usePersistFn } from '@/hooks/usePersistFn';

export const useStoreData = () => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [updateFormState, updateFrom] = useAsyncFn(async (params, cb?) => {
    return await _updateLoan(params)
      .then(async (res) => {
        await router.push({
          pathname: URL_HASH[params.nextSnapshot],
          query: { loanId: params.loanId },
        });
        cb?.();
        return res;
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
  }, []);

  const [redirectFromState, redirectFrom] = useAsyncFn(async (params) => {
    return await _redirectLoan(params)
      .then(async (res) => {
        await router.push({
          pathname: URL_HASH[params.nextSnapshot],
          query: { loanId: params.loanId },
        });
        return res;
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
  });

  const bindLoan = usePersistFn((params) => {
    _bindLoan(params)
      .then((res) => res)
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  });

  return {
    updateFormState,
    updateFrom,
    redirectFromState,
    redirectFrom,
    bindLoan,
  };
};
