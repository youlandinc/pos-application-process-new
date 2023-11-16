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

const DynamicDocumentsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/DocumentsPage').then(
      (mod) => mod.DocumentsPage,
    ),
  {
    ssr: true,
  },
);
const TaskDocuments: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Documents</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicDocumentsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskDocuments;
