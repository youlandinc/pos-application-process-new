import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicLoanDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/LoanDetailsPage').then(
      (mod) => mod.LoanDetailsPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskLoanDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicLoanDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskLoanDetails;
