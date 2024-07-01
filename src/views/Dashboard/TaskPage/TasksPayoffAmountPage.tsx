import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksPayoffAmount } from '@/components/molecules';

export const TasksPayoffAmountPage: FC = observer(() => {
  return <TasksPayoffAmount />;
});
