import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskCoBorrowerDetails,
  BridgeRefinanceTaskCoBorrowerDetails,
  FixPurchaseTaskCoBorrowerDetails,
  FixRefinanceTaskCoBorrowerDetails,
  GroundPurchaseTaskCoBorrowerDetails,
  GroundRefinanceTaskCoBorrowerDetails,
} from '@/components/organisms';

export const CoBorrowerDetailsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskCoBorrowerDetails />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskCoBorrowerDetails />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskCoBorrowerDetails />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskCoBorrowerDetails />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskCoBorrowerDetails />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskCoBorrowerDetails />;
      }
      default:
        return <BridgePurchaseTaskCoBorrowerDetails />;
    }
  }, [scene]);

  return <>{renderNode}</>;
});
