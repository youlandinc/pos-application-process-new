import { FC, useState } from 'react';
import { Fade, Stack } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';

import { HttpError } from '@/types';
import { _fetchLoanDetail } from '@/requests/dashboard';

export const Terms: FC = () => {
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const {
        data: { data },
      } = await _fetchLoanDetail(loanId);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [location?.href]);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={3}
        justifyContent={'flex-start'}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        I am LoanTerms
      </Stack>
    </Fade>
  );
};
