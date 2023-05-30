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

export const BridgePurchasePayment: FC = observer(() => {
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
          backToList={() => router.push('/dashboard/tasks/list')}
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
          task={dashboardTask}
          taskId={taskId}
        />
      </Box>
    </Box>
  );
});

//const temp = [
//  {
//    status: false,
//    label: 'Application information',
//    key: '1',
//    parentKey: '',
//    children: [
//      { label: 'Loan details', status: true, key: '1-1', parentKey: '1' },
//      {
//        label: 'Property details',
//        status: false,
//        key: '1-2',
//        parentKey: '1',
//      },
//      {
//        label: 'Real estate investment experience',
//        status: false,
//        key: '1-3',
//        parentKey: '1',
//      },
//      { label: 'Purchase details', status: true, key: '1-4', parentKey: '1' },
//    ],
//  },
//  {
//    label: 'Payment',
//    status: false,
//    key: 'BPPayment',
//    parentKey: '',
//    children: [
//      {
//        label: 'Pay for property appraisal and lock your rate',
//        status: false,
//        key: 'BPPayment_pay',
//        parentKey: 'BPPayment',
//      },
//    ],
//  },
//];
//
//const [activeKey, setActiveKey] = useState<string>();
//
//const onItemClick = useCallback((item: StatusTreeNode) => {
//  setActiveKey(item.key);
//}, []);
//
//const renderTaskItem = useMemo(() => {
//  switch (activeKey) {
//    case 'BPPayment_pay':
//      return <MortgagePurchaseTask />;
//  }
//}, [activeKey]);

//<>
//  {!activeKey && (
//    <Box className={classes.container}>
//      <PageHeader
//        title={'Your loan checklist'}
//        subTitle={
//          'Just a couple more questions we need to ask before approving your loan.'
//        }
//      />
//      <Box className={classes.pageMain}>
//        <Box className={classes.pageMainTitle}>Your loan task</Box>
//        <StatusTask data={temp} onItemClick={onItemClick} />
//      </Box>
//    </Box>
//  )}
//  {renderTaskItem}
//</>
