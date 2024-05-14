import { FC } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicDocumentsPage = dynamic(
  () =>
    import('@/views/Dashboard/DocumentsPage').then((mod) => mod.DocumentsPage),
  {
    ssr: true,
  },
);

const DashboardDocumentsPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Documents</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicDocumentsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardDocumentsPage;
