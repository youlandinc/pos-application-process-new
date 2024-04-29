import { FC, useLayoutEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { POSGetParamsFromUrl } from '@/utils';
import { useRouter } from 'next/router';
import { useSessionStorageState, useStoreData } from '@/hooks';
import { useMst } from '@/models/Root';
import { Box, Fade } from '@mui/material';

import { LoanAddress } from '@/components/molecules/Application';
import { LoanSnapshotEnum } from '@/types';

export const LoanAddressPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm } = useMst();
  const { loanAddress } = applicationForm;

  const { updateFrom, updateFormState, redirectFrom, redirectFromState } =
    useStoreData();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.estimate_rate,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    const postData = {
      snapshot: LoanSnapshotEnum.loan_address,
      nextSnapshot: LoanSnapshotEnum.background_information,
      loanId: applicationForm.loanId,
      data: loanAddress.getPostData(),
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
          <LoanAddress
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
