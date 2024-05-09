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

const DynamicTasksInvestmentExperiencePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksInvestmentExperiencePage').then(
      (mod) => mod.TasksInvestmentExperiencePage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskRealEstateInvestmentExperience: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Borrower</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksInvestmentExperiencePage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskRealEstateInvestmentExperience;
