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

const DynamicAgreementsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/AgreementsPage').then(
      (mod) => mod.AgreementsPage,
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
        <DynamicAgreementsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Task;
