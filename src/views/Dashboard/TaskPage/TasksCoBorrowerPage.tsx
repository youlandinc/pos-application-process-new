import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksCoBorrower } from '@/components/molecules';

export const TasksCoBorrowerPage: FC = observer(() => {
  return <TasksCoBorrower />;
});
