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

const DynamicTasksCoBorrowerPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksCoBorrowerPage').then(
      (mod) => mod.TasksCoBorrowerPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskCoBorrower: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Co-borrower Information</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksCoBorrowerPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskCoBorrower;
