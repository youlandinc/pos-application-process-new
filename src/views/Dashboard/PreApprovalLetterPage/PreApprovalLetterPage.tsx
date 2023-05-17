import { FC, useMemo } from 'react';

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import {
  // MortgagePurchasePreApproval,
  BridgePurchasePreApproval,
  BridgeRefinancePreApproval,
} from '@/components/organisms';

export const PreApprovalLetterPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderPreApprovalPage = useMemo(() => {
    switch (scene) {
      // case 'mortgage purchase':
      //   return <MortgagePurchasePreApproval />;
      case 'bridge purchase':
        return <BridgePurchasePreApproval />;
      case 'bridge refinance':
        return <BridgeRefinancePreApproval />;
      default:
        return <BridgeRefinancePreApproval />;
    }
  }, [scene]);

  return <>{renderPreApprovalPage}</>;
});
