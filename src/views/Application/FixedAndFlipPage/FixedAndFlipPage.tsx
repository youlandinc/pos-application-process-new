import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSLayout } from '@/components/molecules';
import { LoanApplication } from '@/components/organisms';

export const FixedAndFlipPage: FC = observer(() => {
  const {
    applicationForm: { applicationType },
  } = useMst();

  return (
    <>
      <POSLayout scene={'application'}>
        <LoanApplication
          applicationType={applicationType}
          productCategory={'fixed_and_flip'}
        />
      </POSLayout>
    </>
  );
});
