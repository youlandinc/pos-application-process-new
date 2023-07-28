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

const DynamicBorrowerTypePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/BorrowerTypePage').then(
      (mod) => mod.BorrowerTypePage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskBorrowerType: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicBorrowerTypePage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskBorrowerType;
