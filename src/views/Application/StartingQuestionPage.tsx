import { FC, useEffect, useLayoutEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { StartingQuestion } from '@/components/molecules/Application';
import { LoanSnapshotEnum } from '@/types';
import { _startNewLoan } from '@/requests/application';
import { useMst } from '@/models/Root';
import { POSGetParamsFromUrl } from '@/utils';
import { useRouter } from 'next/router';
import { useSessionStorageState, useStoreData } from '@/hooks';
import { StyledLoading } from '@/components/atoms';
import { Box, Fade } from '@mui/material';

export const StartingQuestionPage: FC = observer(() => {
  const router = useRouter();
  const { saasState } = useSessionStorageState('tenantConfig');
  const { applicationForm } = useMst();

  const { updateFrom, updateFormState } = useStoreData();

  const next = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);

    if (!loanId) {
      const postData = {
        ...applicationForm.startingQuestion.getPostData(),
        tenantId: saasState?.tenantId || '1000052023020700000112',
      };
      applicationForm.setLoading(true);
      const { data } = await _startNewLoan(postData);
      await router.push({
        pathname: '/estimate-rate',
        query: { loanId: data.loanId },
      });
      applicationForm.setLoading(false);
      applicationForm.setSnapshot(LoanSnapshotEnum.estimate_rate);
      return;
    }
    const postData = {
      data: applicationForm.startingQuestion.getPostData(),
      nextSnapshot: LoanSnapshotEnum.estimate_rate,
      snapshot: LoanSnapshotEnum.starting_question,
      loanId,
    };
    await updateFrom(postData);
    await router.push({
      pathname: '/estimate-rate',
      query: { loanId },
    });
  };

  useLayoutEffect(
    () => {
      const { loanId } = POSGetParamsFromUrl(location.href);
      if (loanId) {
        applicationForm.fetchApplicationFormData(loanId);
        return;
      }
      applicationForm.resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Fade in={!applicationForm.loading}>
      <Box>
        {!applicationForm.loading && (
          <StartingQuestion
            nextState={updateFormState.loading}
            nextStep={next}
          />
        )}
      </Box>
    </Fade>
  );
});
