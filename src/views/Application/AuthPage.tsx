import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { Auth } from '@/components/molecules/Application';

import { LoanSnapshotEnum } from '@/types';

export const AuthPage: FC = observer(() => {
  const { applicationForm } = useMst();

  const { redirectFrom, redirectFromState } = useStoreData();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.estimate_rate,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.loan_address,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  useLayoutEffect(
    () => {
      const { loanId } = POSGetParamsFromUrl(location.href);
      if (loanId) {
        applicationForm.fetchApplicationFormData(loanId);
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Fade in={!applicationForm.loading}>
      <Box>
        {!applicationForm.loading && (
          <Auth
            backState={redirectFromState.loading}
            backStep={back}
            nextState={redirectFromState.loading}
            nextStep={next}
          />
        )}
      </Box>
    </Fade>
  );
});
