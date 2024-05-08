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

const DynamicOverviewPage = dynamic(
  () =>
    import('@/views/Dashboard/OverviewPage').then((mod) => mod.OverviewPage),
  {
    ssr: true,
  },
);

const DashboardOverviewPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicOverviewPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardOverviewPage;
