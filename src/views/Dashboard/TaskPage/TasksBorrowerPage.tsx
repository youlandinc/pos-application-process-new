import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksBorrower } from '@/components/molecules';

export const TasksBorrowerPage: FC = observer(() => {
  return <TasksBorrower />;
});
