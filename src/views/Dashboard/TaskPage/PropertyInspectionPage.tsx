import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  BridgePurchaseTaskPropertyInspection,
  BridgeRefinanceTaskPropertyInspection,
} from '@/components/organisms';

export const PropertyInspectionPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      //  case 'mortgage purchase': {
      //    return <MortgagePurchaseTask />;
      //  }
      //  case 'mortgage refinance': {
      //    return <MortgageRefinanceTask />;
      //  }
      case 'bridge purchase': {
        return <BridgePurchaseTaskPropertyInspection />;
      }
      case 'bridge refinance': {
        return <BridgeRefinanceTaskPropertyInspection />;
      }
      default:
        return <BridgePurchaseTaskPropertyInspection />;
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
