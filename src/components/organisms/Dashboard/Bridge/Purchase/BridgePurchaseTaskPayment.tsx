import { FC, useEffect, useState } from 'react';

import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { ParseProcess } from '@/services/ParseProcess';
import { POSFlex } from '@/styles';
// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';
import { BridgePurchaseRatesLoanInfo, RatesProductData } from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductSelected,
} from '@/requests/dashboard';
import {
  BridgePurchasePaymentSummary,
  PaymentTask,
} from '@/components/molecules';
import { Box } from '@mui/material';

const useStyles = {
  '&.container': {
    ...POSFlex('flex-start', 'center', 'column'),
  },
  '& .pageMain': {
    width: '100%',
    maxWidth: 900,
    borderRadius: 8,
  },
};

export const BridgePurchaseTaskPayment: FC = observer(() => {
  const {
    selectedProcessData,
    dashboardTask,
    userSetting: {
      setting: { lastSelectedProcessId },
    },
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { data: processData } = selectedProcessData;

  const [loanInfo, setLoanInfo] = useState<BridgePurchaseRatesLoanInfo>();
  const [productInfo, setProductInfo] = useState<RatesProductData>();
  const [taskId, setTaskId] = useState<string>('');

  const { loading } = useAsync(async () => {
    return Promise.all([
      _fetchRatesLoanInfo(lastSelectedProcessId),
      _fetchRatesProductSelected(lastSelectedProcessId),
    ])
      .then((res) => {
        const { info } = res[0].data;
        setLoanInfo(info);
        setProductInfo(res[1].data);
      })
      .catch((err) => enqueueSnackbar(err, { variant: 'error' }));
  }, [lastSelectedProcessId]);

  useEffect(() => {
    if (processData) {
      const parseProcess = new ParseProcess(processData);
      setTaskId(parseProcess.paymentTaskId);
    }
  }, [processData]);

  return (
    <Box className={'container'} sx={useStyles}>
      <Box className={'pageMain'}>
        <PaymentTask
          backToList={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
          loanDetail={
            <BridgePurchasePaymentSummary
              loading={loading}
              loanInfo={loanInfo}
              productInfo={productInfo}
            />
          }
          paymentStatus={dashboardTask.paymentStatus}
          processId={lastSelectedProcessId as string}
          productType={'bridge'}
          sceneType={'purchase'}
          task={dashboardTask}
          taskId={taskId}
        />
      </Box>
    </Box>
  );
});
