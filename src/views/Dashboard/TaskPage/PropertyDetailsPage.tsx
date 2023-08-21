import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskPropertyDetails,
  BridgeRefinanceTaskPropertyDetails,
  FixPurchaseTaskPropertyDetails,
  FixRefinanceTaskPropertyDetails,
  GroundPurchaseTaskPropertyDetails,
  GroundRefinanceTaskPropertyDetails,
} from '@/components/organisms';

export const PropertyDetailsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskPropertyDetails />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskPropertyDetails />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskPropertyDetails />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskPropertyDetails />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskPropertyDetails />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskPropertyDetails />;
      }
      default:
        return <BridgePurchaseTaskPropertyDetails />;
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
