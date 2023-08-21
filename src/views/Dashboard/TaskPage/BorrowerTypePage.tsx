import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

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
