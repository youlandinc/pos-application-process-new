import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import {
  _fetchRatesLoanInfo,
  _fetchRatesProductSelected,
} from '@/requests/dashboard';
import { TaskList } from '@/components/molecules';
import { Box } from '@mui/material';

export const BridgePurchaseTaskList: FC = observer(() => {
  return <TaskList />;
});
