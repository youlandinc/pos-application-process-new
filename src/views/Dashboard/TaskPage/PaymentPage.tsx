import { FC, useMemo } from 'react';
import { Box, SxProps } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  BridgePurchaseTaskPayment,
  BridgeRefinanceTaskPayment,
} from '@/components/organisms';

export const PaymentPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const PaymentPageStyles: SxProps = {
    px: {
      lg: 3,
      xs: 0,
    },
    maxWidth: 900,
    width: '100%',
    mx: {
      lg: 'auto',
      xs: 0,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  };
  const renderPaymentPage = useMemo(() => {
    switch (scene) {
      //  case 'mortgage purchase': {
      //    return <MortgagePurchaseTask />;
      //  }
      //  case 'mortgage refinance': {
      //    return <MortgageRefinanceTask />;
      //  }
      case 'bridge purchase': {
        return <BridgePurchaseTaskPayment />;
      }
      case 'bridge refinance': {
        return <BridgeRefinanceTaskPayment />;
      }
      default:
        return <BridgePurchaseTaskPayment />;
    }
  }, [scene]);

  return <Box sx={PaymentPageStyles}>{renderPaymentPage}</Box>;
});
