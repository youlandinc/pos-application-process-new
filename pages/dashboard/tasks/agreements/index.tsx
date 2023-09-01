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

const DynamicAgreementsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/AgreementsPage').then(
      (mod) => mod.AgreementsPage,
    ),
  {
    ssr: true,
  },
);
const TaskAgreements: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicAgreementsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskAgreements;
