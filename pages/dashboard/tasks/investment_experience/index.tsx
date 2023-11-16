import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicInvestmentExperiencePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/InvestmentExperiencePage').then(
      (mod) => mod.InvestmentExperiencePage,
    ),
  {
    ssr: true,
  },
);
const TaskInvestmentExperience: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Real Estate Investment Experience</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicInvestmentExperiencePage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskInvestmentExperience;
