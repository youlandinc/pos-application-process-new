import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { Appraisal } from '@/components/organisms';

export const AppraisalPage: FC = observer(() => {
  return <Appraisal />;
});
