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

const DynamicProviderInformationPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/ProviderInformationPage').then(
      (mod) => mod.ProviderInformationPage,
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
        <DynamicProviderInformationPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Task;
