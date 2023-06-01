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

const DynamicPropertyDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PropertyDetailsPage').then(
      (mod) => mod.PropertyDetailsPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskPropertyDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPropertyDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyDetails;
