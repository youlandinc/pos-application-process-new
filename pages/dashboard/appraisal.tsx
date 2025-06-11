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

const DynamicAppraisalPagePage = dynamic(
  () =>
    import('@/views/Dashboard/AppraisalPage').then((mod) => mod.AppraisalPage),
  {
    ssr: true,
  },
);

const DashboardAppraisalPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Appraisal</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicAppraisalPagePage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardAppraisalPage;
