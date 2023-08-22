import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  BridgePurchaseTaskCompanyInformation,
  BridgeRefinanceTaskCompanyInformation,
  FixPurchaseTaskCompanyInformation,
  FixRefinanceTaskCompanyInformation,
  GroundPurchaseTaskCompanyInformation,
  GroundRefinanceTaskCompanyInformation,
} from '@/components/organisms';

export const CompanyInformationPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskCompanyInformation />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskCompanyInformation />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskCompanyInformation />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskCompanyInformation />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskCompanyInformation />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskCompanyInformation />;
      }
      default:
        return <BridgePurchaseTaskCompanyInformation />;
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
