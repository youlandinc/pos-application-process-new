import { FC, useMemo } from 'react';
import { Box, SxProps } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { BridgePurchaseTask } from '@/components/organisms';

export const TaskPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const TaskPageStyles: SxProps = {
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
  const renderTaskPage = useMemo(() => {
    switch (scene) {
      //  case 'mortgage purchase': {
      //    return <MortgagePurchaseTask />;
      //  }
      //  case 'mortgage refinance': {
      //    return <MortgageRefinanceTask />;
      //  }
      case 'bridge purchase': {
        return <BridgePurchaseTask />;
      }
      //  case 'bridge refinance': {
      //    return <BridgeRefinanceTask />;
      //  }
      default:
        return <BridgePurchaseTask />;
    }
  }, [scene]);

  return <Box sx={TaskPageStyles}>{renderTaskPage}</Box>;
});
