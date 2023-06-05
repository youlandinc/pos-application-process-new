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

const DynamicPayPage = dynamic(
  () => import('@/views/Dashboard/TaskPage/PayPage').then((mod) => mod.PayPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskPay: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPayPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPay;
