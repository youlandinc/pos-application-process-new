import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';
import {
  BridgePurchaseOverview,
  BridgeRefinanceOverview,
  FixPurchaseOverview,
  FixRefinanceOverview,
  GroundPurchaseOverview,
  GroundRefinanceOverview,
} from '@/components/organisms';

export const OverviewPage: FC = observer(() => {
  const {
    selectedProcessData: { scene, loading },
  } = useMst();

  const renderOverPage = useMemo(() => {
    if (loading) {
      return null;
    }
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseOverview />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceOverview />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseOverview />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceOverview />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseOverview />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceOverview />;
      }
      default: {
        return <BridgePurchaseOverview />;
      }
    }
  }, [scene, loading]);

  return <>{renderOverPage}</>;
});
