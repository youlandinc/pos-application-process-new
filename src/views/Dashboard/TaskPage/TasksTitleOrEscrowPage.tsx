import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksTitleOrEscrow } from '@/components/molecules';

export const TasksTitleOrEscrowPage: FC = observer(() => {
  return <TasksTitleOrEscrow />;
});
