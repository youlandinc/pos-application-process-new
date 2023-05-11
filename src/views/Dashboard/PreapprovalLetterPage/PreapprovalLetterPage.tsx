import React, { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';

import {
  // MortgagePurchasePreApproval,
  // BridgePurchasePreApproval,
  BridgeRefinancePreApproval,
} from '@/components/organisms';
import { useMst } from '@/models/Root';

export const PreapprovalLetterPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderPreApprovalPage = useMemo(() => {
    switch (scene) {
      // case 'mortgage purchase':
      //   return <MortgagePurchasePreApproval />;
      // case 'bridge purchase':
      //   return <BridgePurchasePreApproval />;
      case 'bridge refinance':
        return <BridgeRefinancePreApproval />;
      default:
        return <BridgeRefinancePreApproval />;
    }
  }, [scene]);

  return <>{renderPreApprovalPage}</>;
});
