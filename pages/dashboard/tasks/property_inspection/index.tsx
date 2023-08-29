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

const DynamicPropertyInspectionPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PropertyInspectionPage').then(
      (mod) => mod.PropertyInspectionPage,
    ),
  {
    ssr: true,
  },
);
const TaskPropertyInspection: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPropertyInspectionPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyInspection;
