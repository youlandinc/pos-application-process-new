import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  BridgePurchaseTaskDocuments,
  BridgeRefinanceTaskDocuments,
  FixPurchaseTaskDocuments,
  FixRefinanceTaskDocuments,
  GroundPurchaseTaskDocuments,
  GroundRefinanceTaskDocuments,
} from '@/components/organisms';

export const DocumentsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskDocuments />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskDocuments />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskDocuments />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskDocuments />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskDocuments />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskDocuments />;
      }
      default:
        return <BridgePurchaseTaskDocuments />;
    }
  }, [scene]);

  return <>{renderNode}</>;
});
