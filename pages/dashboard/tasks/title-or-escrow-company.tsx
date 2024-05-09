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

const DynamicTasksTitleOrEscrowPagePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksTitleOrEscrowPage').then(
      (mod) => mod.TasksTitleOrEscrowPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskTitleOrEscrowCompany: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Borrower</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksTitleOrEscrowPagePage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskTitleOrEscrowCompany;
