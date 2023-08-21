import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskInvestmentExperience,
  BridgeRefinanceTaskInvestmentExperience,
  FixPurchaseTaskInvestmentExperience,
  FixRefinanceTaskInvestmentExperience,
  GroundPurchaseTaskInvestmentExperience,
  GroundRefinanceTaskInvestmentExperience,
} from '@/components/organisms';

export const InvestmentExperiencePage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskInvestmentExperience />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskInvestmentExperience />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskInvestmentExperience />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskInvestmentExperience />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskInvestmentExperience />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskInvestmentExperience />;
      }
      default:
        return <BridgePurchaseTaskInvestmentExperience />;
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
