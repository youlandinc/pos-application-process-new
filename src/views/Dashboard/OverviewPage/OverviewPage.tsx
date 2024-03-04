import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState } from '@/hooks';
import { SceneType } from '@/types';
import {
  BridgePurchaseOverview,
  BridgeRefinanceOverview,
  FixPurchaseOverview,
  FixRefinanceOverview,
  GroundPurchaseOverview,
  GroundRefinanceOverview,
} from '@/components/organisms';
import { Stack } from '@mui/material';
import { StyledLoading } from '@/components/atoms';

export const OverviewPage: FC = observer(() => {
  const {
    selectedProcessData: { scene, loading },
  } = useMst();

  const router = useRouter();

  const { saasState } = useSessionStorageState('tenantConfig');

  const renderOverPage = useMemo(() => {
    const { processId } = router.query;
    if (!processId || loading || !scene || !saasState?.serviceTypeEnum) {
      return (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          margin={'auto 0'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      );
    }
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseOverview />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceOverview />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseOverview />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceOverview />;
      }
      case SceneType.ground_purchase: {
        return <GroundPurchaseOverview />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceOverview />;
      }
      default: {
        return <BridgePurchaseOverview />;
      }
    }
  }, [loading, router.query, saasState?.serviceTypeEnum, scene]);

  return <>{renderOverPage}</>;
});
