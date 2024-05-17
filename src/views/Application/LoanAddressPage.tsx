import { FC, useLayoutEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { HttpErrorType, LoanSnapshotEnum } from '@/types';

import { LoanAddress } from '@/components/molecules/Application';

export const LoanAddressPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm } = useMst();
  const { loanAddress } = applicationForm;

  const [stateError, setStateError] = useState(false);

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
    await updateFrom(postData).then((res) => {
      if (res === HttpErrorType.state_verify_error) {
        setStateError(true);
      }
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
            stateError={stateError}
          />
        )}
      </Box>
    </Fade>
  );
});
