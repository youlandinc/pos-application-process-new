import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksSquareFootage } from '@/components/molecules';

export const TasksSquareFootagePage: FC = observer(() => {
  return <TasksSquareFootage />;
});
