import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseRates,
  BridgeRefinanceRates,
  FixPurchaseRates,
  FixRefinanceRates,
  GroundPurchaseRates,
  GroundRefinanceRates,
} from '@/components/organisms';

export const RatesPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderRatesPage = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseRates />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceRates />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseRates />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceRates />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseRates />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceRates />;
      }
      default:
        return <BridgePurchaseRates />;
    }
  }, [scene]);

  return <>{renderRatesPage}</>;
});
