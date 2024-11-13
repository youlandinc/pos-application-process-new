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

const DynamicTermsPage = dynamic(
  () => import('@/views/Dashboard/TermsPage').then((mod) => mod.TermsPage),
  {
    ssr: true,
  },
);

const DashboardTermsPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTermsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTermsPage;
