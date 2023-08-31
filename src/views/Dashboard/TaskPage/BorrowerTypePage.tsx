import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskBorrowerType,
  BridgeRefinanceTaskBorrowerType,
  FixPurchaseTaskBorrowerType,
  FixRefinanceTaskBorrowerType,
  GroundPurchaseTaskBorrowerType,
  GroundRefinanceTaskBorrowerType,
} from '@/components/organisms';

export const BorrowerTypePage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskBorrowerType />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskBorrowerType />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskBorrowerType />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskBorrowerType />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskBorrowerType />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskBorrowerType />;
      }
      default:
        return <BridgePurchaseTaskBorrowerType />;
    }
  }, [scene]);

  return <>{renderNode}</>;
});
