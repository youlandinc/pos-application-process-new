import { FC, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

import { LoanSummary } from '@/components/molecules/Application';

import { HttpError, LoanSnapshotEnum, UserType } from '@/types';

export const LoanSummaryPage: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { applicationForm, userType } = useMst();

  const { redirectFrom, redirectFromState, updateFormState, updateFrom } =
    useStoreData();

  const [data, setData] = useState({});

  const back = async () => {
    if (!userType) {
      return;
    }
    const postData = {
      nextSnapshot:
        userType === UserType.CUSTOMER
          ? LoanSnapshotEnum.background_information
          : LoanSnapshotEnum.compensation_page,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    if (!userType) {
      return;
    }
    const postData = {
      snapshot: LoanSnapshotEnum.loan_summary,
      nextSnapshot: LoanSnapshotEnum.loan_overview,
      loanId: applicationForm.loanId,
      data: {},
    };
    await updateFrom(postData, () =>
      router.push({
        pathname: '/dashboard/overview',
        query: { loanId: applicationForm.loanId },
      }),
    );
  };

  useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (loanId) {
      try {
        const data = await applicationForm.fetchApplicationFormData(loanId);
        setData(data);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      }
      return;
    }
    applicationForm.resetForm();
    await router.push('/');
  });

  return (
    <Fade in={!applicationForm.loading}>
      <Box>
        {!applicationForm.loading && (
          <LoanSummary
            backState={redirectFromState.loading}
            backStep={back}
            data={data}
            nextState={updateFormState.loading}
            nextStep={next}
          />
        )}
      </Box>
    </Fade>
  );
});
