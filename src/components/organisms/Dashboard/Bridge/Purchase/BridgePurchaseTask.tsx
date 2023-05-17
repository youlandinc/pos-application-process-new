import { FC, useEffect, useState } from 'react';

import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { ParseProcess } from '@/services/ParseProcess';
import { POSFlex, POSFont, POSSize } from '@/styles';
// import { BPPaymentSummary, PaymentTask } from '@/components/molecules';
import { BPRatesLoanInfo, RatesProductData } from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductSelected,
} from '@/requests/dashboard';
import {
  //  BPPaymentSummary,
  PaymentTask,
} from '@/components/molecules';
import { Box } from '@mui/material';

const useStyles = {
  '&.container': {
    ...POSFlex('flex-start', 'center', 'column'),
    // px: {
    //   lg: 3,
    //   xs: 0,
    // },
    // maxWidth: 900,
    // mx: {
    //   lg: 'auto',
    //   xs: 0,
    // },
  },
  '& .pageMain': {
    width: '100%',
    //marginTop: 48,
    // minWidth: 904,
    maxWidth: 900,
    //boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.15)',
    borderRadius: 8,
    //padding: '24px 48px',
  },
  '& .pageMainTitle': {
    ...POSFont(24, 700, 1.5, 'rgba(0,0,0,.87)'),
  },
  '& .listBox': {
    padding: '24px 0',
    borderBottom: '1px solid #C4C4C4',
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  '& .listTitle': {
    ...POSFont(24, 700, 1.5, 'rgba(0,0,0,.6)'),
    ...POSFlex('center', 'space-between', 'row'),
  },
  '& .listTitleState': {
    ...POSFlex('center', 'space-between', 'row'),
    ...POSFont(12, 400, 1.5, 'rgba(0,0,0,.87)'),
    background: '#F5F8FA',
    borderRadius: 4,
    padding: '8px 16px',
    width: 100,
  },
  '& .circle': {
    flexShrink: 0,
    ...POSSize(10),
    borderRadius: '50%',
    marginRight: 8,
  },
  '& .listItem': {
    marginTop: 12,
    width: '100%',
    whiteSpace: 'break-spaces',
    wordBreak: 'break-word',
    color: 'rgba(0,0,0,.6)',
    transition: 'all .3s',
    cursor: 'default',
    '&:hover': {
      color: '#3F81E9',
    },
  },
};

export const BridgePurchaseTask: FC = observer(() => {
  const {
    selectedProcessData,
    dashboardTask,
    userSetting: {
      setting: { lastSelectedProcessId },
    },
  } = useMst();

  const { data: processData } = selectedProcessData;

  const [loanInfo, setLoanInfo] = useState<BPRatesLoanInfo>();
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
      .catch((err) => console.log(err));
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
          loanDetail={
            // <BPPaymentSummary
            //   loading={loading}
            //   loanInfo={loanInfo}
            //   productInfo={productInfo}
            // />
            <></>
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
