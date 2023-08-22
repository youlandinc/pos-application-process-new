import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

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

  return (
    <Stack
      flexDirection={'column'}
      justifyContent={'flex-start'}
      maxWidth={900}
      mx={{ lg: 'auto', xs: 0 }}
      px={{ lg: 3, xs: 0 }}
      width={'100%'}
    >
      {renderPaymentPage}
    </Stack>
  );
});
