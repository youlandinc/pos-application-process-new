import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicPreApprovalLetterPage = dynamic(
  () =>
    import('@/views/Dashboard/PreApprovalLetterPage').then(
      (mod) => mod.PreApprovalLetterPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const PreApprovalLetter: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPreApprovalLetterPage />
      </DynamicDashboardPage>
    </>
  );
});

export default PreApprovalLetter;
