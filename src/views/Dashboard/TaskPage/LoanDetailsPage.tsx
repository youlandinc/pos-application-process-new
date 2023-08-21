import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  BridgePurchaseTaskLoanDetails,
  BridgeRefinanceTaskLoanDetails,
  FixPurchaseTaskLoanDetails,
  FixRefinanceTaskLoanDetails,
  GroundPurchaseTaskLoanDetails,
  GroundRefinanceTaskLoanDetails,
} from '@/components/organisms';

export const LoanDetailsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskLoanDetails />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskLoanDetails />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskLoanDetails />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskLoanDetails />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskLoanDetails />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskLoanDetails />;
      }
      default:
        return <BridgePurchaseTaskLoanDetails />;
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
      {renderNode}
    </Stack>
  );
});
