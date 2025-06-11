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

const DynamicTasksHoldbackProcessPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksHoldbackProcessPage').then(
      (mod) => mod.TasksHoldbackProcessPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskConstructionHoldbackProcess: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Construction Holdback Process</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksHoldbackProcessPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskConstructionHoldbackProcess;
