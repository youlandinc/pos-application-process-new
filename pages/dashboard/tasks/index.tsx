import { FC } from 'react';
import { DashboardPage, TaskPage } from '@/views';

const Task: FC = () => {
  return (
    <>
      <DashboardPage>
        <TaskPage />
      </DashboardPage>
    </>
  );
};

export default Task;
