import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSLayout } from '@/components/molecules';
import { LoanApplication } from '@/components/organisms';

export const FixPage: FC = observer(() => {
  const {
    applicationForm: { applicationType },
  } = useMst();

  return (
    <>
      <POSLayout scene={'application'}>
        <LoanApplication
          applicationType={applicationType}
          productCategory={'fix_and_flip'}
        />
      </POSLayout>
    </>
  );
});
