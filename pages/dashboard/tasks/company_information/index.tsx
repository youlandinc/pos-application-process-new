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

const DynamicCompanyInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/CompanyInformationPage').then(
      (mod) => mod.CompanyInformationPage,
    ),
  {
    ssr: true,
  },
);
const TaskCompanyInformation: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicCompanyInformationPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskCompanyInformation;
