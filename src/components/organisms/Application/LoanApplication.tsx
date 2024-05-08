import { useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  Auth,
  BackgroundInformation,
  CompensationInformation,
  EstimateRate,
  LoanAddress,
  LoanSummary,
  StartingQuestion,
} from '@/components/molecules/Application';

import { StyledLoading } from '@/components/atoms';

import { LoanSnapshotEnum } from '@/types';

const useGenerateComponent = () => {
  const {
    applicationForm: { snapshot },
  } = useMst();

  const renderFormNode = useMemo(() => {
    switch (snapshot) {
      case LoanSnapshotEnum.starting_question:
        return <StartingQuestion />;
      case LoanSnapshotEnum.auth_page:
        return <Auth />;
      case LoanSnapshotEnum.estimate_rate:
        return <EstimateRate />;
      case LoanSnapshotEnum.loan_address:
        return <LoanAddress />;
      case LoanSnapshotEnum.background_information:
        return <BackgroundInformation />;
      case LoanSnapshotEnum.compensation_page:
        return <CompensationInformation />;
      case LoanSnapshotEnum.loan_summary:
        return <LoanSummary />;
      default:
        return null;
    }
  }, [snapshot]);

  return {
    renderFormNode,
  };
};

export const LoanApplication = observer(() => {
  const store = useMst();
  const { applicationForm } = store;

  const { renderFormNode } = useGenerateComponent();

  return (
    <>
      {!applicationForm.initialized ? (
        <Stack
          alignItems={'center'}
          height={'calc(100vh - 252px)'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      ) : (
        <Stack alignItems={'center'} width={'100%'}>
          {renderFormNode}
        </Stack>
      )}
    </>
  );
});
