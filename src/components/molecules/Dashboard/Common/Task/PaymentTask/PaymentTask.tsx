import { FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack, SxProps } from '@mui/material';
import { useAsync } from 'react-use';

import { RatesProductData } from '@/types';

// import { IDashboardTask } from '@/models/DashboardTask';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledLoading,
  StyledTextField,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';
import {
  ConfirmTable,
  NoticeTable,
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
import { useSnackbar } from 'notistack';
import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';

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

type PaymentTableState = 'confirm' | 'notice' | 'payment';

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
        back: () => void;
      }
    >
  >({
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
        updateState('notice');
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
  sceneType?: 'purchase' | 'refinance';
}

export const PaymentTask: FC<PaymentTaskProps> = (props) => {
  const {
    processId,
    paymentStatus,
    task,
    taskId,
    loanDetail,
    productType = 'mortgage',
    sceneType = 'purchase',
    backToList,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const paymentCardFormRef = useRef(null);

  const resetTable = useCallback(() => {
    setTableStatus('confirm');
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

  const [tableStatus, setTableStatus] = useState<PaymentTableState>('confirm');
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  const [noticeCheck, setNoticeCheck] = useState<boolean>(false);
  const [paymentCheck, setPaymentCheck] = useState<boolean>(false);
  const [clickable, setClickable] = useState<boolean>(true);
  const [appraisal, setAppraisal] = useState<boolean>(false);
  const [appraisalCompany, setAppraisalCompany] = useState('');
  const [appraisalDate, setAppraisalDate] = useState<string | Date>('');

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
        enqueueSnackbar(err, { variant: 'error' });
      });
  }, [task.taskInitialized, paymentStatus]);

  const { back, next } = useStateMachine(
    tableStatus,
    setTableStatus,
    backToList as () => void,
  );

  const renderRateForm = useMemo(() => {
    return (
      <Stack gap={3}>
        <StyledFormItem
          label={'Do you have a recent Property Appraisal？'}
          maxWidth={600}
          mt={3}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value !== null) {
                setAppraisal(value === 'yes');
              }
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={appraisal}
          />
        </StyledFormItem>
        <Transitions style={{ width: '100%' }}>
          {appraisal && (
            <>
              {sceneType !== 'refinance' && (
                <StyledFormItem
                  gap={3}
                  label={'Appraisal Information'}
                  labelSx={{ mb: 0 }}
                  mb={3}
                  sub
                >
                  <Stack
                    flexDirection={{ lg: 'row', xs: 'column' }}
                    gap={3}
                    mt={3}
                    width={'100%'}
                  >
                    <StyledTextField
                      label={'Appraisal Company'}
                      onChange={(e) => setAppraisalCompany(e.target.value)}
                      value={appraisalCompany}
                    />
                    <StyledDatePicker
                      label={'Appraisal Due Date'}
                      onChange={(date) =>
                        setAppraisalDate(date as string | Date)
                      }
                      value={appraisalDate}
                    />
                  </Stack>
                </StyledFormItem>
              )}

              <StyledFormItem
                label={'Upload Property Appraisal'}
                maxWidth={900}
                sub
                tip={'Next, fill out your Experience Verification Sheet'}
              >
                <StyledUploadBox
                  fileList={[]}
                  onDelete={() => {
                    console.log('onDelete');
                  }}
                  onSuccess={() => {
                    console.log('onSuccess');
                  }}
                />
              </StyledFormItem>
            </>
          )}
        </Transitions>
      </Stack>
    );
  }, [appraisal, appraisalCompany, appraisalDate, sceneType]);

  const renderPaymentTaskComponent = useMemo(() => {
    switch (tableStatus) {
      case 'confirm':
        return (
          <ConfirmTable
            check={confirmCheck}
            onCheckValueChange={(e) => setConfirmCheck(e.target.checked)}
          />
        );
      case 'notice':
        return (
          <NoticeTable
            check={noticeCheck}
            loanDetail={loanDetail}
            onCheckValueChange={(e) => setNoticeCheck(e.target.checked)}
            productType={productType}
            rateForm={renderRateForm}
          />
        );
      case 'payment':
        return (
          <PaymentTable
            check={paymentCheck}
            // loanDetail={loanDetail}
            onCheckValueChange={(e) => setPaymentCheck(e.target.checked)}
            paymentDetail={paymentDetail as SPaymentDetails}
            productType={productType}
            ref={paymentCardFormRef}
          />
        );
    }
  }, [
    tableStatus,
    confirmCheck,
    noticeCheck,
    loanDetail,
    productType,
    renderRateForm,
    paymentCheck,
    paymentDetail,
  ]);

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
