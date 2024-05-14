import { FC, ReactNode, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';

import { POSLayout } from '@/components/molecules';

import { LayoutSceneTypeEnum } from '@/types';

export const ApplicationPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    const { applicationForm, session } = useMst();
    const { bindLoan } = useStoreData();
    const router = useRouter();

    useLayoutEffect(() => {
      if (
        applicationForm.loading ||
        !applicationForm.initialized ||
        !session ||
        !router.query.loanId
      ) {
        return;
      }
      if (!applicationForm.isBind) {
        bindLoan({ loanId: router.query.loanId });
        applicationForm.setIsBind(true);
      }
    }, [
      applicationForm,
      applicationForm.initialized,
      applicationForm.isBind,
      applicationForm.loading,
      applicationForm.loanId,
      bindLoan,
      router.query.loanId,
      session,
    ]);

    return (
      <POSLayout scene={LayoutSceneTypeEnum.application}>{children}</POSLayout>
    );
  },
);
