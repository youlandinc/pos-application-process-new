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

const DynamicTasksSquareFootage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksSquareFootagePage').then(
      (mod) => mod.TasksSquareFootagePage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskSquareFootage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Square Footage</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksSquareFootage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskSquareFootage;
