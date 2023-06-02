import { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { ParseProcess } from '@/services/ParseProcess';
import { POSFlex } from '@/styles';
import {
  BridgeRefinancePaymentSummary,
  PaymentTask,
} from '@/components/molecules';
import { BridgeRefinanceRatesLoanInfo, RatesProductData } from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductSelected,
} from '@/requests/dashboard';

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

export const BridgeRefinanceTaskPayment: FC = observer(() => {
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

  const [loanInfo, setLoanInfo] = useState<BridgeRefinanceRatesLoanInfo>();
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
        ('');
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
          backToList={() => router.push('/dashboard/tasks')}
          loanDetail={
            <BridgeRefinancePaymentSummary
              loading={loading}
              loanInfo={loanInfo}
              productInfo={productInfo}
            />
          }
          paymentStatus={dashboardTask.paymentStatus}
          processId={lastSelectedProcessId as string}
          productType={'bridge'}
          task={dashboardTask}
          taskId={taskId}
        />
      </Box>
    </Box>
  );
});
