import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  BridgePurchaseOverview,
  BridgeRefinanceOverview,
} from '@/components/organisms';

export const OverviewPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();
  const renderOverPage = useMemo(() => {
    switch (scene) {
      // to do
      // case 'mortgage purchase': {
      //   return <MortgagePurchaseOverview />;
      // }
      // case 'mortgage refinance': {
      //   return <MortgageRefinanceOverview />;
      // }
      case 'bridge purchase': {
        return <BridgePurchaseOverview />;
      }
      case 'bridge refinance': {
        return <BridgeRefinanceOverview />;
      }
      default:
        return <BridgeRefinanceOverview />;
    }
  }, [scene]);
  return <>{renderOverPage}</>;
});
