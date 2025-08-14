import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { LoanSnapshotEnum } from '@/types';

import { LandReadiness } from '@/components/molecules/Application';

export const LandReadinessPage: FC = observer(() => {
  const router = useRouter();

  const { redirectFrom, redirectFromState, updateFrom, updateFormState } =
    useStoreData();

  const { applicationForm } = useMst();

  const { landReadiness } = applicationForm;

  const next = async () => {
    const postData = {
      data: {
        ...landReadiness.getPostData(),
      },
      snapshot: LoanSnapshotEnum.land_readiness,
      nextSnapshot: LoanSnapshotEnum.estimate_rate,
      loanId: applicationForm.loanId,
    };
    await updateFrom(postData);
  };

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.starting_question,
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
      applicationForm.resetForm();
      router.push('/');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Fade in={!applicationForm.loading}>
      <Box>
        {!applicationForm.loading && (
          <LandReadiness
            backState={redirectFromState.loading}
            backStep={back}
            nextState={updateFormState.loading}
            nextStep={next}
          />
        )}
      </Box>
    </Fade>
  );
});
