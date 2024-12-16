import { FC, useLayoutEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION, URL_HASH } from '@/constants';

import { StartingQuestion } from '@/components/molecules/Application';

import {
  HttpError,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanSnapshotEnum,
} from '@/types';
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
    const storeData = applicationForm.startingQuestion.getPostData();
    const { productCategory, propertyType } = storeData;

    let toSnapshot = LoanSnapshotEnum.estimate_rate;

    const isEnterLoanInfo =
      productCategory === LoanProductCategoryEnum.dscr_rental ||
      propertyType === LoanPropertyTypeEnum.multifamily;

    const isContactInfo = propertyType === LoanPropertyTypeEnum.commercial;

    switch (true) {
      case isEnterLoanInfo:
        toSnapshot = LoanSnapshotEnum.enter_loan_info;
        break;
      case isContactInfo:
        toSnapshot = LoanSnapshotEnum.contact_info;
        break;
    }

    if (!loanId) {
      if (!saasState?.tenantId) {
        return;
      }
      const postData = {
        ...storeData,
        tenantId: saasState?.tenantId || '1000052023020700000112',
      };
      setLoading(true);
      try {
        const { data } = await _startNewLoan(postData);
        applicationForm.setSnapshot(toSnapshot);
        await router.push({
          pathname: URL_HASH[toSnapshot],
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
      data: storeData,
      nextSnapshot: toSnapshot,
      snapshot: LoanSnapshotEnum.starting_question,
      loanId,
    };
    await updateFrom(postData);
    await router.push({
      pathname: URL_HASH[toSnapshot],
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
