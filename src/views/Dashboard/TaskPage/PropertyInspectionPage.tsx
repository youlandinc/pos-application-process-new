import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';
import {
  BridgePurchaseTaskPropertyInspection,
  BridgeRefinanceTaskPropertyInspection,
  FixPurchaseTaskPropertyInspection,
  FixRefinanceTaskPropertyInspection,
} from '@/components/organisms';

export const PropertyInspectionPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskPropertyInspection />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskPropertyInspection />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskPropertyInspection />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskPropertyInspection />;
      }
      default:
        return <BridgePurchaseTaskPropertyInspection />;
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
