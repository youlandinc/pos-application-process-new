import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicPayPage = dynamic(
  () => import('@/views/Dashboard/TaskPage/PayPage').then((mod) => mod.PayPage),
  {
    ssr: true,
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
