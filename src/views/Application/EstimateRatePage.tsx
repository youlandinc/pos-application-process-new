import { FC, useLayoutEffect } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { LoanProductCategoryEnum, LoanSnapshotEnum } from '@/types';

import { EstimateRate } from '@/components/molecules/Application';

export const EstimateRatePage: FC = observer(() => {
  const router = useRouter();

  const { redirectFrom, redirectFromState, updateFrom, updateFormState } =
    useStoreData();

  const { applicationForm } = useMst();

  const { estimateRate } = applicationForm;

  const next = async () => {
    const postData = {
      data: {
        ...estimateRate.getPostData(),
        isCustom: false,
      },
      snapshot: LoanSnapshotEnum.estimate_rate,
      nextSnapshot: applicationForm.isBind
        ? LoanSnapshotEnum.loan_address
        : LoanSnapshotEnum.auth_page,
      loanId: applicationForm.loanId,
    };
    await updateFrom(postData);
  };

  const back = async () => {
    const storeData = estimateRate.getPostData();

    const postData = {
      nextSnapshot:
        storeData.productCategory === LoanProductCategoryEnum.land
          ? LoanSnapshotEnum.land_readiness
          : LoanSnapshotEnum.starting_question,
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
          <EstimateRate
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
