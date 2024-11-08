import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksPermitsObtained } from '@/components/molecules';

export const TasksPermitsObtainedPage: FC = observer(() => {
  return <TasksPermitsObtained />;
});
