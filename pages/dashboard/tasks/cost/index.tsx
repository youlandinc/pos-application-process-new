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

const DynamicPaymentPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PaymentPage').then(
      (mod) => mod.PaymentPage,
    ),
  {
    ssr: true,
  },
);
const TaskPayment: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPaymentPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPayment;
