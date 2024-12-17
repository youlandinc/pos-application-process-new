import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { LoanSnapshotEnum } from '@/types';

import { SubmitLead } from '@/components/molecules/Application';

export const SubmitLeadPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm } = useMst();

  const { redirectFrom, redirectFromState, updateFormState, updateFrom } =
    useStoreData();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.starting_question,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    const postData = {
      snapshot: LoanSnapshotEnum.contact_info,
      nextSnapshot: LoanSnapshotEnum.thank_you_page,
      loanId: applicationForm.loanId,
      data: applicationForm.submitLead.getPostData(),
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
          <SubmitLead
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
