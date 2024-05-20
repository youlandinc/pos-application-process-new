import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Appraisal } from '@/components/organisms';

export const AppraisalPage: FC = observer(() => {
  return <Appraisal />;
});
