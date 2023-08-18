import { FC, useMemo } from 'react';

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import { SceneType } from '@/types';

import {
  BridgePurchasePreApproval,
  BridgeRefinancePreApproval,
  FixPurchasePreApproval,
  FixRefinancePreApproval,
  GroundPurchasePreApproval,
  GroundRefinancePreApproval,
} from '@/components/organisms';

export const PreApprovalLetterPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderPreApprovalPage = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchasePreApproval />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinancePreApproval />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchasePreApproval />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinancePreApproval />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchasePreApproval />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinancePreApproval />;
      }
      default: {
        return <BridgePurchasePreApproval />;
      }
    }
  }, [scene]);

  return <>{renderPreApprovalPage}</>;
});
