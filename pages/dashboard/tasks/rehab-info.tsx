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

const DynamicTasksRehabInfoPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksRehabInfoPage').then(
      (mod) => mod.TasksRehabInfoPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskRehabInfo: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Rehab Info</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksRehabInfoPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskRehabInfo;
