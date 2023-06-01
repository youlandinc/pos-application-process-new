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

const DynamicCompanyInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/CompanyInformationPage').then(
      (mod) => mod.CompanyInformationPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const Task: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicCompanyInformationPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Task;
