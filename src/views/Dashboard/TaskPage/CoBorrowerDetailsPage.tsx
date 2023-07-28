import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskCoBorrowerDetails,
  BridgeRefinanceTaskCoBorrowerDetails,
  FixPurchaseTaskCoBorrowerDetails,
  FixRefinanceTaskCoBorrowerDetails,
} from '@/components/organisms';

export const CoBorrowerDetailsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskCoBorrowerDetails />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskCoBorrowerDetails />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskCoBorrowerDetails />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskCoBorrowerDetails />;
      }
      default:
        return <BridgePurchaseTaskCoBorrowerDetails />;
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
