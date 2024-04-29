import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';
import { useStoreData } from '@/hooks';
import { LoanSnapshotEnum } from '@/types';

import { LoanSummary } from '@/components/molecules/Application';

export const LoanSummaryPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm, userType } = useMst();
  const { compensationInformation } = applicationForm;

  const { updateFrom, updateFormState, redirectFrom, redirectFromState } =
    useStoreData();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.background_information,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    if (!userType) {
      return;
    }
    const postData = {
      snapshot: LoanSnapshotEnum.compensation_page,
      nextSnapshot: LoanSnapshotEnum.loan_summary,
      loanId: applicationForm.loanId,
      data: compensationInformation.getPostData(),
    };
    await updateFrom(postData);
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
          <LoanSummary
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
