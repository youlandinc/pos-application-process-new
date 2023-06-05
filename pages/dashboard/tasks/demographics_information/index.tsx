import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicDemographicsInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/DemographicsInformationPage').then(
      (mod) => mod.DemographicsInformationPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
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
