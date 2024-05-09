import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksHoldbackProcess } from '@/components/molecules';

export const TasksHoldbackProcessPage: FC = observer(() => {
  return <TasksHoldbackProcess />;
});
