import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskDemographicsInformation,
  BridgeRefinanceTaskDemographicsInformation,
  FixPurchaseTaskDemographicsInformation,
  FixRefinanceTaskDemographicsInformation,
  GroundPurchaseTaskDemographicsInformation,
  GroundRefinanceTaskDemographicsInformation,
} from '@/components/organisms';

export const DemographicsInformationPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskDemographicsInformation />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskDemographicsInformation />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskDemographicsInformation />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskDemographicsInformation />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskDemographicsInformation />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskDemographicsInformation />;
      }
      default:
        return <BridgePurchaseTaskDemographicsInformation />;
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
