import Head from 'next/head';
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

const DynamicTaskListPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskListPage').then((mod) => mod.TaskListPage),
  {
    ssr: true,
  },
);
const DashboardTaskPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTaskListPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskPage;
