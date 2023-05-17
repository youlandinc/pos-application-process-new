import React, {
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, SxProps } from '@mui/material';
import { useAsync } from 'react-use';

import { RatesProductData } from '@/types';

// import { IDashboardTask } from '@/models/DashboardTask';

import { StyledButton, StyledLoading } from '@/components/atoms';
import {
  CheckList,
  // ConfirmTable,
  // NoticeTable,
  PaymentStatusPage,
  PaymentTable,
} from './components';
import { _updateTask } from '@/requests';
import {
  _fetchPaymentDetails,
  SPaymentDetails,
  STaskItemStatus,
} from '@/requests/dashboard';
import { IDTask } from '@/models/base';
import { POSFlex } from '@/styles';

const useStyle: SxProps = {
  ...POSFlex('center', 'center', 'column'),
  '& .paymentTitle': {
    marginTop: 72,
    fontSize: 36,
    lineHeight: 1,
    color: 'rgba(0,0,0,.87)',
    fontWeight: 700,
  },
  '& .paymentSubTitle': {
    paddingTop: 12,
    fontSize: 16,
    lineHeight: 1,
    color: 'rgba(0,0,0,.38)',
  },
  '& .paymentCheck': {
    margin: '24px 0',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,.6)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  '& .paymentCardBox': {
    paddingTop: 24,
    paddingBottom: 48,
  },
  '& .buttonGroup': {
    mt: 6,
    textAlign: 'center',
    gap: 3,
    width: '100%',
    maxWidth: 600,
    ...POSFlex('center', 'center', 'row'),
    '& button': {
      flex: 1,
    },
  },
};

export interface PaymentTaskBaseComponentProps<T = any> {
  productInfo?: RatesProductData;
  loanInfo?: T;
}

type PaymentTableState = 'checklist' | 'confirm' | 'notice' | 'payment';

const useStateMachine = (
  state: PaymentTableState,
  updateState: React.Dispatch<React.SetStateAction<PaymentTableState>>,
  backToList: () => void,
) => {
  const transitions = useRef<
    Record<
      PaymentTableState,
      {
        next?: () => void;
        back?: () => void;
      }
    >
  >({
    checklist: {
      next() {
        // updateState('payment');
      },
    },
    confirm: {
      back() {
        backToList && backToList();
      },
      next() {
        updateState('notice');
      },
    },
    notice: {
      back() {
        updateState('confirm');
      },
      next() {
        updateState('payment');
      },
    },
    payment: {
      back() {
        updateState('checklist');
      },
    },
  });
  const next = useCallback(() => {
    (transitions.current[state] as unknown as any).next();
  }, [state]);

  const back = useCallback(() => {
    transitions.current[state].back();
  }, [state]);

  return {
    next,
    back,
  };
};

interface PaymentTaskProps {
  paymentStatus: STaskItemStatus | 'fail';
  processId: string;
  task: IDTask;
  taskId: string;
  loanDetail: ReactNode;
  backToList?: () => void;
  productType?: ProductCategory;
}

export const PaymentTask: FC<PaymentTaskProps> = (props) => {
  const {
    processId,
    paymentStatus,
    task,
    taskId,
    loanDetail,
    productType = 'mortgage',
    backToList,
  } = props;

  const paymentCardFormRef = useRef(null);

  const resetTable = useCallback(() => {
    setTableStatus('checklist');
    setConfirmCheck(false);
    setNoticeCheck(false);
    setPaymentCheck(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setClickable(false);
      if (taskId) {
        await _updateTask(taskId, 'complete');
      }
      const paymentRes = await (
        paymentCardFormRef.current as unknown as any
      ).onSubmit(e);
      setClickable(true);
      if (paymentRes) {
        const { status } = paymentRes;
        resetTable();
        task.changeFieldValue('paymentStatus', status);
      }
    },
    [resetTable, task, taskId],
  );

  const [tableStatus, setTableStatus] =
    useState<PaymentTableState>('checklist');
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  const [noticeCheck, setNoticeCheck] = useState<boolean>(false);
  const [paymentCheck, setPaymentCheck] = useState<boolean>(false);
  const [clickable, setClickable] = useState<boolean>(true);

  const [paymentDetail, setPaymentDetail] = useState<SPaymentDetails>();

  const { loading } = useAsync(async () => {
    if (!task.taskInitialized || paymentStatus === 'complete') {
      return;
    }
    return await _fetchPaymentDetails({ procInstId: processId })
      .then((res) => {
        setPaymentDetail(res.data);
      })
      .catch((err) => {
        // todo, lee this error need to handler
        console.log(err);
      });
  }, [task.taskInitialized, paymentStatus]);

  const { back, next } = useStateMachine(
    tableStatus,
    setTableStatus,
    backToList as () => void,
  );

  const renderPaymentTaskComponent = useMemo(() => {
    switch (tableStatus) {
      case 'checklist':
        return <CheckList updateState={() => setTableStatus('payment')} />;
      // case 'confirm':
      //   return (
      //     <ConfirmTable
      //       check={confirmCheck}
      //       onCheckValueChange={(e) => setConfirmCheck(e.target.checked)}
      //     />
      //   );
      // case 'notice':
      //   return (
      //     <NoticeTable
      //       check={noticeCheck}
      //       loanDetail={loanDetail}
      //       onCheckValueChange={(e) => setNoticeCheck(e.target.checked)}
      //       productType={productType}
      //     />
      //   );
      case 'payment':
        return (
          <PaymentTable
            check={paymentCheck}
            loanDetail={loanDetail}
            onCheckValueChange={(e) => setPaymentCheck(e.target.checked)}
            paymentDetail={paymentDetail as SPaymentDetails}
            productType={productType}
            ref={paymentCardFormRef}
          />
        );
    }
  }, [tableStatus, productType, loanDetail, paymentDetail, paymentCheck]);

  const disabledButton = useMemo(() => {
    switch (tableStatus) {
      case 'confirm':
        return !confirmCheck;
      case 'notice':
        return !noticeCheck || loading;
      case 'payment':
        return !paymentCheck || !clickable || loading;
    }
  }, [
    clickable,
    confirmCheck,
    loading,
    noticeCheck,
    paymentCheck,
    tableStatus,
  ]);

  const renderButton = useMemo(() => {
    switch (tableStatus) {
      case 'checklist':
        return <></>;
      case 'confirm':
      case 'notice':
        return (
          <Box className={'buttonGroup'}>
            <StyledButton color={'info'} onClick={back} variant={'text'}>
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={disabledButton}
              onClick={next}
            >
              Next
            </StyledButton>
          </Box>
        );
      case 'payment':
        return (
          <Box className={'buttonGroup'}>
            <StyledButton color={'info'} onClick={back} variant={'text'}>
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={disabledButton}
              onClick={(e) => handleSubmit(e)}
            >
              Pay now
            </StyledButton>
          </Box>
        );
    }
  }, [back, disabledButton, handleSubmit, next, tableStatus]);

  return (
    <Box sx={useStyle}>
      {task.taskInitialized ? (
        paymentStatus === 'undone' ? (
          <>
            {renderPaymentTaskComponent}
            {renderButton}
          </>
        ) : (
          <PaymentStatusPage paymentStatus={paymentStatus} task={task} />
        )
      ) : (
        <StyledLoading />
      )}
    </Box>
  );
};
