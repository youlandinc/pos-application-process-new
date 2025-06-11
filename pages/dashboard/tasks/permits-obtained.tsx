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

const DynamicTasksPermitsObtainedPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksPermitsObtainedPage').then(
      (mod) => mod.TasksPermitsObtainedPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTasksPermitsObtained: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Permits Obtained</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksPermitsObtainedPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTasksPermitsObtained;
