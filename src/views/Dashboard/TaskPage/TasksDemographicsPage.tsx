import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksDemographics } from '@/components/molecules';

export const TasksDemographicsPage: FC = observer(() => {
  return <TasksDemographics />;
});
