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

const DynamicPropertyInspectionPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PropertyInspectionPage').then(
      (mod) => mod.PropertyInspectionPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskPropertyInspection: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPropertyInspectionPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyInspection;
