import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  BridgePurchaseTaskAgreements,
  BridgeRefinanceTaskAgreements,
  FixPurchaseTaskAgreements,
  FixRefinanceTaskAgreements,
} from '@/components/organisms';

export const AgreementsPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskAgreements />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskAgreements />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskAgreements />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskAgreements />;
      }
      default:
        return <BridgePurchaseTaskAgreements />;
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
