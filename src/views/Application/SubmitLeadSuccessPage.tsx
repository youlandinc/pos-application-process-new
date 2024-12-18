import { FC, useLayoutEffect, useMemo } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';

import { SubmitLeadSuccess } from '@/components/molecules/Application';
import { useSessionStorageState } from '@/hooks';

export const SubmitLeadSuccessPage: FC = observer(() => {
  const router = useRouter();

  const { applicationForm, session } = useMst();

  const hasSession = useMemo<boolean>(() => !!session, [session]);
  const { saasState } = useSessionStorageState('tenantConfig');

  const next = async () => {
    if (!hasSession) {
      return (location.href = saasState.website);
    }
    await router.push('/pipeline');
  };

  useLayoutEffect(
    () => {
      const { loanId } = POSGetParamsFromUrl(location.href);
      if (loanId) {
        applicationForm.fetchApplicationFormData(loanId);
        return;
      }
      applicationForm.resetForm();
      router.push('/');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Fade in={!applicationForm.loading}>
      <Box>
        {!applicationForm.loading && <SubmitLeadSuccess nextStep={next} />}
      </Box>
    </Fade>
  );
});
