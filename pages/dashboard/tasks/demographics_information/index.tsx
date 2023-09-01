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

const DynamicDemographicsInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/DemographicsInformationPage').then(
      (mod) => mod.DemographicsInformationPage,
    ),
  {
    ssr: true,
  },
);
const TaskPropertyDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicDemographicsInformationPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyDetails;
