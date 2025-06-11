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

const DynamicTasksDemographicsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TasksDemographicsPage').then(
      (mod) => mod.TasksDemographicsPage,
    ),
  {
    ssr: true,
  },
);

const DashboardTaskDemographicsInformation: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Tasks - Demographic Information</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTasksDemographicsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default DashboardTaskDemographicsInformation;
