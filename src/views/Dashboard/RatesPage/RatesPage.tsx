import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  // MortgagePurchaseRates,
  // MortgageRefinanceRates,
  BridgePurchaseRates,
  // BridgeRefinanceRates,
} from '@/components/organisms';

export const RatesPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderRatesPage = useMemo(() => {
    switch (scene) {
      // case 'mortgage purchase': {
      //   return <MortgagePurchaseRates />;
      // }
      // case 'mortgage refinance': {
      //   return <MortgageRefinanceRates />;
      // }
      case 'bridge purchase': {
        return <BridgePurchaseRates />;
      }
      // case 'bridge refinance': {
      //   return <BridgeRefinanceRates />;
      // }
      default:
        return <BridgePurchaseRates />;
    }
  }, [scene]);

  return <>{renderRatesPage}</>;
});
