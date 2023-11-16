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

const DynamicOverviewPage = dynamic(
  () =>
    import('@/views/Dashboard/OverviewPage').then((mod) => mod.OverviewPage),
  {
    ssr: true,
  },
);

const Overview: FC = observer(() => {
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

export default Overview;
