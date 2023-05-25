import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSLayout } from '@/components/molecules';
import { LoanApplication } from '@/components/organisms';

export const BridgePage: FC = observer(() => {
  const {
    applicationForm: { applicationType },
  } = useMst();

  return (
    <>
      <POSLayout scene={'application'}>
        <LoanApplication
          applicationType={applicationType}
          productCategory={'bridge'}
        />
      </POSLayout>
    </>
  );
});
