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

const DynamicPersonalDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/PersonalDetailsPage').then(
      (mod) => mod.PersonalDetailsPage,
    ),
  {
    ssr: true,
  },
);
const TaskPropertyDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPersonalDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskPropertyDetails;
