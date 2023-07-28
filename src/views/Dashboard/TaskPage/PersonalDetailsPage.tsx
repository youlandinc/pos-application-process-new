import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskPersonalDetails,
  BridgeRefinanceTaskPersonalDetails,
  FixPurchaseTaskPersonalDetails,
  FixRefinanceTaskPersonalDetails,
} from '@/components/organisms';

export const PersonalDetailsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskPersonalDetails />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskPersonalDetails />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskPersonalDetails />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskPersonalDetails />;
      }
      default:
        return <BridgePurchaseTaskPersonalDetails />;
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
