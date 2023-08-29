import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicPropertyDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PropertyDetailsPage').then(
      (mod) => mod.PropertyDetailsPage,
    ),
  {
    ssr: true,
  },
);
const TaskPropertyDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPropertyDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyDetails;
