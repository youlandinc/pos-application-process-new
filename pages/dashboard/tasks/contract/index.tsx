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

const DynamicContractPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/ContractPage').then(
      (mod) => mod.ContractPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskContract: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicContractPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskContract;
