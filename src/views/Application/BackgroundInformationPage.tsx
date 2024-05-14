import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { LoanSnapshotEnum, UserType } from '@/types';

import { BackgroundInformation } from '@/components/molecules/Application';

export const BackgroundInformationPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm, userType } = useMst();
  const { backgroundInformation } = applicationForm;

  const { updateFrom, updateFormState, redirectFrom, redirectFromState } =
    useStoreData();

  const back = async () => {
    const postData = {
      nextSnapshot: LoanSnapshotEnum.loan_address,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    if (!userType) {
      return;
    }
    const postData = {
      snapshot: LoanSnapshotEnum.background_information,
      nextSnapshot:
        userType === UserType.CUSTOMER
          ? LoanSnapshotEnum.loan_summary
          : LoanSnapshotEnum.compensation_page,
      loanId: applicationForm.loanId,
      data: backgroundInformation.getPostData(),
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
          <BackgroundInformation
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
