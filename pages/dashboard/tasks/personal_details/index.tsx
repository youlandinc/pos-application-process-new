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

const DynamicPersonalDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PersonalDetailsPage').then(
      (mod) => mod.PersonalDetailsPage,
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
        <DynamicPersonalDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyDetails;
