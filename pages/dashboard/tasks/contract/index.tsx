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

const DynamicContractPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/ContractPage').then(
      (mod) => mod.ContractPage,
    ),
  {
    ssr: true,
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
