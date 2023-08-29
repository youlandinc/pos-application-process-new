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

const DynamicTaskListPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/TaskListPage').then(
      (mod) => mod.TaskListPage,
    ),
  {
    ssr: true,
  },
);
const Task: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicTaskListPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Task;
