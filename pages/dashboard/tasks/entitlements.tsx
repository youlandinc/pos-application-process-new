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

const DynamicTasksEntitlementsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksEntitlementsPage').then(
      (mod) => mod.TasksEntitlementsPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskEntitlements: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Entitlements</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksEntitlementsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskEntitlements;
