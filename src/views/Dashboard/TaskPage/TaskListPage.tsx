import { FC, useMemo } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskList,
  BridgeRefinanceTaskList,
  FixPurchaseTaskList,
  FixRefinanceTaskList,
} from '@/components/organisms';

export const TaskListPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderTaskPage = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskList />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskList />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskList />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskList />;
      }
      default:
        return <BridgePurchaseTaskList />;
    }
  }, [scene]);

  return <Box sx={{ width: '100%' }}>{renderTaskPage}</Box>;
});
