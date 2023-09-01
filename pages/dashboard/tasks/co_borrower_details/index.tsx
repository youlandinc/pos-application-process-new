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

const DynamicCoBorrowerDetailsPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/CoBorrowerDetailsPage').then(
      (mod) => mod.CoBorrowerDetailsPage,
    ),
  {
    ssr: true,
  },
);
const TaskCoBorrowerDetails: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicCoBorrowerDetailsPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskCoBorrowerDetails;
