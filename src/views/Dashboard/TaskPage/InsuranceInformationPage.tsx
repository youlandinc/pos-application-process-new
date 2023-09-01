import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  BridgePurchaseTaskInsuranceInformation,
  BridgeRefinanceTaskInsuranceInformation,
  FixPurchaseTaskInsuranceInformation,
  FixRefinanceTaskInsuranceInformation,
  GroundPurchaseTaskInsuranceInformation,
  GroundRefinanceTaskInsuranceInformation,
} from '@/components/organisms';

export const InsuranceInformationPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskInsuranceInformation />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskInsuranceInformation />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskInsuranceInformation />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskInsuranceInformation />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskInsuranceInformation />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskInsuranceInformation />;
      }
      default:
        return <BridgePurchaseTaskInsuranceInformation />;
    }
  }, [scene]);

  return (
    <Stack
      maxWidth={900}
      mx={{ lg: 'auto', xs: 0 }}
      px={{ lg: 3, xs: 0 }}
      width={'100%'}
    >
      {renderNode}
    </Stack>
  );
});
