import { FC } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicTasksPayoffAmountPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksPayoffAmountPage').then(
      (mod) => mod.TasksPayoffAmountPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskPayoffAmount: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Borrower</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksPayoffAmountPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskPayoffAmount;
