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

const DynamicBorrowerTypePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksBorrowerPage').then(
      (mod) => mod.TasksBorrowerPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskBorrower: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Borrower</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicBorrowerTypePage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskBorrower;
