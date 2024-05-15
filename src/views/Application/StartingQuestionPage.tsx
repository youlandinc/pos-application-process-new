import { FC, useLayoutEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

import { StartingQuestion } from '@/components/molecules/Application';

import { HttpError, LoanSnapshotEnum } from '@/types';
import { _startNewLoan } from '@/requests/application';

export const StartingQuestionPage: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const { applicationForm } = useMst();

  const { updateFrom, updateFormState } = useStoreData();

  const [loading, setLoading] = useState(false);

  const next = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);

    if (!loanId) {
      if (!saasState?.tenantId) {
        return;
      }
      const postData = {
        ...applicationForm.startingQuestion.getPostData(),
        tenantId: saasState?.tenantId || '1000052023020700000112',
      };
      setLoading(true);
      try {
        const { data } = await _startNewLoan(postData);
        applicationForm.setSnapshot(LoanSnapshotEnum.estimate_rate);
        await router.push({
          pathname: '/estimate-rate',
          query: { loanId: data.loanId },
        });
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setLoading(false);
      }
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
            createLoading={loading}
            nextState={updateFormState.loading}
            nextStep={next}
          />
        )}
      </Box>
    </Fade>
  );
});
