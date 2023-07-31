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
      default:
        return <BridgePurchaseTaskDocuments />;
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
