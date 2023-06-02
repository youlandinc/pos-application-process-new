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

const DynamicCoBorrowerDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/CoBorrowerDetailsPage').then(
      (mod) => mod.CoBorrowerDetailsPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskCoBorrowerDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicCoBorrowerDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskCoBorrowerDetails;
