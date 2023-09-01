import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicInsuranceInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/InsuranceInformationPage').then(
      (mod) => mod.InsuranceInformationPage,
    ),
  {
    ssr: true,
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
