import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksRehabInfo } from '@/components/molecules';

export const TasksRehabInfoPage: FC = observer(() => {
  return <TasksRehabInfo />;
});
