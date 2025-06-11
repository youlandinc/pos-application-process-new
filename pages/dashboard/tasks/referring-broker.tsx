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

const DynamicTasksReferringBrokerPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksReferringBrokerPage').then(
      (mod) => mod.TasksReferringBrokerPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskRehabInfo: FC = observer(() => {
  return (
    <>
      <Head>
        <title key={'title'}>Tasks - Referring Broker</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksReferringBrokerPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskRehabInfo;
