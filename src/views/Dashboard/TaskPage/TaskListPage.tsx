import { FC, useMemo } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  BridgePurchaseTaskList,
  BridgeRefinanceTaskList,
} from '@/components/organisms';

export const TaskListPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderTaskPage = useMemo(() => {
    switch (scene) {
      //  case 'mortgage purchase': {
      //    return <MortgagePurchaseTask />;
      //  }
      //  case 'mortgage refinance': {
      //    return <MortgageRefinanceTask />;
      //  }
      case 'bridge purchase': {
        return <BridgePurchaseTaskList />;
      }
      case 'bridge refinance': {
        return <BridgeRefinanceTaskList />;
      }
      default:
        return <BridgePurchaseTaskList />;
    }
  }, [scene]);

  return <Box sx={{ width: '100%' }}>{renderTaskPage}</Box>;
});
