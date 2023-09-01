import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';
import {
  BridgePurchaseTaskPayment,
  BridgeRefinanceTaskPayment,
  FixPurchaseTaskPayment,
  FixRefinanceTaskPayment,
  GroundPurchaseTaskPayment,
  GroundRefinanceTaskPayment,
} from '@/components/organisms';

export const PaymentPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderPaymentPage = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskPayment />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskPayment />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskPayment />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskPayment />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskPayment />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskPayment />;
      }
      default:
        return <BridgePurchaseTaskPayment />;
    }
  }, [scene]);

  return <>{renderPaymentPage}</>;
});
