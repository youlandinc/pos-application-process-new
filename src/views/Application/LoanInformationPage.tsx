import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { LoanSnapshotEnum } from '@/types';

import { LoanInformation } from '@/components/molecules/Application';

export const LoanInformationPage: FC = observer(() => {
  const router = useRouter();

  const { updateFrom, updateFormState, redirectFrom, redirectFromState } =
    useStoreData();

  const { applicationForm } = useMst();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.starting_question,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    console.log(applicationForm.loanInformation.getPostData());
    const postData = {
      data: applicationForm.loanInformation.getPostData(),
      snapshot: LoanSnapshotEnum.enter_loan_info,
      nextSnapshot: applicationForm.isBind
        ? LoanSnapshotEnum.loan_address
        : LoanSnapshotEnum.auth_page,
      loanId: applicationForm.loanId,
    };
    await updateFrom(postData);
    //console.log(applicationForm.loanInformation.getPostData());
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
          <LoanInformation
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
