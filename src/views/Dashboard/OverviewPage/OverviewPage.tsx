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
    selectedProcessData: { scene },
  } = useMst();
  const renderOverPage = useMemo(() => {
    switch (scene) {
      // todo
      // case 'mortgage purchase': {
      //   return <MortgagePurchaseOverview />;
      // }
      // case 'mortgage refinance': {
      //   return <MortgageRefinanceOverview />;
      // }
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
  }, [scene]);
  return <>{renderOverPage}</>;
});
