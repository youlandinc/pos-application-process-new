import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicInsuranceInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/InsuranceInformationPage').then(
      (mod) => mod.InsuranceInformationPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskInsuranceInformation: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicInsuranceInformationPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskInsuranceInformation;
