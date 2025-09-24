import { FC, useEffect, useLayoutEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import {
  HttpErrorType,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanSnapshotEnum,
  UserType,
} from '@/types';

import { LoanAddress } from '@/components/molecules/Application';

export const LoanAddressPage: FC = observer(() => {
  const router = useRouter();
  const { applicationForm, userType } = useMst();
  const { loanAddress, productCategory, propertyType } = applicationForm;

  const [stateError, setStateError] = useState(false);

  const { updateFrom, updateFormState, redirectFrom, redirectFromState } =
    useStoreData();

  const back = async () => {
    const isEnterLoanInfo =
      productCategory === LoanProductCategoryEnum.dscr_rental ||
      propertyType === LoanPropertyTypeEnum.multifamily;

    const toSnapshot = isEnterLoanInfo
      ? LoanSnapshotEnum.enter_loan_info
      : LoanSnapshotEnum.estimate_rate;

    const postData = {
      nextSnapshot: toSnapshot,
      loanId: applicationForm.loanId,
    };
    await redirectFrom(postData);
  };

  const next = async () => {
    if (!userType) {
      return;
    }
    const postData = {
      snapshot: LoanSnapshotEnum.loan_address,
      nextSnapshot:
        userType === UserType.CUSTOMER
          ? LoanSnapshotEnum.select_executive
          : LoanSnapshotEnum.compensation_page,
      loanId: applicationForm.loanId,
      data: loanAddress.getLoanAddressPostData(),
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

  useEffect(() => {
    setStateError(false);
  }, [loanAddress.state]);

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
