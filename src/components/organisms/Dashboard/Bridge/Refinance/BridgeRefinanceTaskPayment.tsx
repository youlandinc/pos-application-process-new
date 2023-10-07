import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { POSNotUndefined } from '@/utils';

import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _fetchPaymentDetails,
  _fetchTaskFormInfo,
  _updateTaskFormInfo,
  SPaymentDetails,
} from '@/requests/dashboard';
import {
  BRRatesLoanInfo,
  DashboardTaskPaymentMethodsStatus,
  DashboardTaskPaymentTableStatus,
  HttpError,
  RatesProductData,
  TaskFiles,
} from '@/types';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import {
  BridgeRefinancePaymentSummary,
  PaymentMethods,
  PaymentNotice,
  PaymentStatus,
  PaymentSummary,
} from '@/components/molecules';

const useStateMachine = (
  state:
    | DashboardTaskPaymentTableStatus.notice
    | DashboardTaskPaymentTableStatus.summary
    | DashboardTaskPaymentTableStatus.payment,
  updateState: React.Dispatch<
    React.SetStateAction<DashboardTaskPaymentTableStatus>
  >,
) => {
  const transitions = useRef<
    Record<
      | DashboardTaskPaymentTableStatus.notice
      | DashboardTaskPaymentTableStatus.summary
      | DashboardTaskPaymentTableStatus.payment,
      {
        next?: () => void;
        back?: () => void;
      }
    >
  >({
    [DashboardTaskPaymentTableStatus.notice]: {
      next() {
        updateState(DashboardTaskPaymentTableStatus.summary);
      },
    },
    [DashboardTaskPaymentTableStatus.summary]: {
      back() {
        updateState(DashboardTaskPaymentTableStatus.notice);
      },
      async next() {
        updateState(DashboardTaskPaymentTableStatus.payment);
      },
    },
    [DashboardTaskPaymentTableStatus.payment]: {
      back() {
        updateState(DashboardTaskPaymentTableStatus.summary);
      },
    },
  });
  const next = useCallback(() => {
    transitions.current[state].next?.();
  }, [state]);

  const back = useCallback(() => {
    transitions.current[state].back?.();
  }, [state]);

  return {
    next,
    back,
  };
};

export const BridgeRefinanceTaskPayment: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const paymentCardFormRef = useRef(null);

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [paymentStatus, setPaymentStatus] =
    useState<DashboardTaskPaymentMethodsStatus>(
      DashboardTaskPaymentMethodsStatus.undone,
    );
  const [tableStatus, setTableStatus] =
    useState<DashboardTaskPaymentTableStatus>(
      DashboardTaskPaymentTableStatus.notice,
    );
  const [noticeCheck, setNoticeCheck] = useState<boolean>(false);
  const [summaryCheck, setSummaryCheck] = useState<boolean>(false);
  const [paymentCheck, setPaymentCheck] = useState<boolean>(false);

  const [clickable, setClickable] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<
    BRRatesLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm'
      >
  >();
  const [haveAppraisal, setHaveAppraisal] = useState<boolean | undefined>();
  const [appraisalFiles, setAppraisalFiles] = useState<TaskFiles[]>([]);
  const [isExpedited, setIsExpedited] = useState<boolean>(false);
  const [paymentDetail, setPaymentDetail] = useState<
    SPaymentDetails | undefined
  >();

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          productInfo,
          haveAppraisal,
          appraisalFiles,
          paymentStatus,
          isConfirm,
          isNotice,
          isExpedited,
        } = res.data;
        setProductInfo(productInfo);
        setHaveAppraisal(haveAppraisal ?? false);
        setAppraisalFiles(appraisalFiles ?? []);
        setIsExpedited(isExpedited ?? false);
        setNoticeCheck(isNotice ?? undefined);
        setSummaryCheck(isConfirm ?? undefined);
        if (appraisalFiles?.length > 0) {
          setTableStatus(DashboardTaskPaymentTableStatus.summary);
        }
        setPaymentStatus(
          paymentStatus as string as DashboardTaskPaymentMethodsStatus,
        );
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.taskId]);

  const resetTable = useCallback(() => {
    setTableStatus(DashboardTaskPaymentTableStatus.notice);
    setSummaryCheck(false);
    setNoticeCheck(false);
    setPaymentCheck(false);
  }, []);

  const handledPayment = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setClickable(false);

      const paymentRes = await (
        paymentCardFormRef.current as unknown as any
      ).onSubmit(e);
      setClickable(true);
      if (paymentRes) {
        const { status } = paymentRes;
        setPaymentStatus(status as string as DashboardTaskPaymentMethodsStatus);
        resetTable();
      }
    },
    [resetTable],
  );

  const disabledButton = useMemo(() => {
    switch (tableStatus) {
      case DashboardTaskPaymentTableStatus.notice:
        return !noticeCheck;
      case DashboardTaskPaymentTableStatus.summary:
        if (!POSNotUndefined(haveAppraisal) || !summaryCheck) {
          return true;
        }
        return haveAppraisal
          ? !appraisalFiles.length || saveLoading
          : saveLoading;
      case DashboardTaskPaymentTableStatus.payment:
        return !paymentCheck || !clickable || loading;
    }
  }, [
    tableStatus,
    noticeCheck,
    haveAppraisal,
    summaryCheck,
    appraisalFiles.length,
    saveLoading,
    paymentCheck,
    clickable,
    loading,
  ]);

  const backToList = useCallback(async () => {
    await router.push({
      pathname: '/dashboard/tasks',
      query: { processId: router.query.processId },
    });
  }, [router]);

  const handledSaveFormAndGetPaymentDetail = useCallback(async () => {
    setSaveLoading(true);

    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        productInfo,
        haveAppraisal,
        appraisalFiles,
        isNotice: noticeCheck,
        isConfirm: summaryCheck,
        isExpedited,
      },
    };

    try {
      await _updateTaskFormInfo(postData);
      const { data } = await _fetchPaymentDetails({
        procInstId: router.query.processId as string,
      });
      setPaymentDetail(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [
    appraisalFiles,
    enqueueSnackbar,
    haveAppraisal,
    isExpedited,
    noticeCheck,
    productInfo,
    router.query.processId,
    router.query.taskId,
    summaryCheck,
  ]);

  const { back, next } = useStateMachine(tableStatus, setTableStatus);

  const renderNode = useMemo(() => {
    switch (tableStatus) {
      case DashboardTaskPaymentTableStatus.notice:
        return (
          <PaymentNotice
            check={noticeCheck}
            onCheckValueChange={(e) => setNoticeCheck(e.target.checked)}
          />
        );
      case DashboardTaskPaymentTableStatus.summary:
        return (
          <PaymentSummary
            check={summaryCheck}
            fileList={appraisalFiles}
            haveAppraisal={haveAppraisal}
            isExpedited={isExpedited}
            loanSummary={
              <BridgeRefinancePaymentSummary productInfo={productInfo} />
            }
            onCheckValueChange={(e) => setSummaryCheck(e.target.checked)}
            onFileListChange={setAppraisalFiles}
            onHaveAppraisalChange={(e, value) => {
              if (value !== null) {
                setHaveAppraisal(value === 'yes');
              }
            }}
            onIsExpeditedChange={(e, value) => {
              if (value !== null) {
                setIsExpedited(value === 'yes');
              }
            }}
            onUploadLoadingChange={setUploadLoading}
            uploadLoading={uploadLoading}
          />
        );
      case DashboardTaskPaymentTableStatus.payment:
        return (
          <PaymentMethods
            check={paymentCheck}
            onCheckValueChange={(e) => setPaymentCheck(e.target.checked)}
            paymentDetail={paymentDetail}
            ref={paymentCardFormRef}
          />
        );
    }
  }, [
    appraisalFiles,
    haveAppraisal,
    isExpedited,
    noticeCheck,
    paymentCheck,
    paymentDetail,
    productInfo,
    summaryCheck,
    tableStatus,
    uploadLoading,
  ]);

  const renderButton = useMemo(() => {
    switch (tableStatus) {
      case DashboardTaskPaymentTableStatus.notice:
        return (
          <Stack
            flexDirection={'row'}
            gap={3}
            justifyContent={'center'}
            maxWidth={600}
            mt={6}
            mx={'auto'}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={async () => {
                await backToList();
                back();
              }}
              sx={{ flex: 1 }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={disabledButton}
              onClick={next}
              sx={{ flex: 1 }}
            >
              Next
            </StyledButton>
          </Stack>
        );
      case DashboardTaskPaymentTableStatus.summary:
        return (
          <Stack
            flexDirection={'row'}
            gap={3}
            justifyContent={'center'}
            maxWidth={600}
            mt={6}
            mx={'auto'}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={back}
              sx={{ flex: 1 }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={disabledButton}
              loading={saveLoading}
              loadingText={'Saving...'}
              onClick={async () => {
                await handledSaveFormAndGetPaymentDetail();
                if (!haveAppraisal) {
                  next();
                  return;
                }
                await backToList();
              }}
              sx={{ flex: 1 }}
            >
              {haveAppraisal ? 'Save' : 'Next'}
            </StyledButton>
          </Stack>
        );
      case DashboardTaskPaymentTableStatus.payment:
        return (
          <Stack
            flexDirection={'row'}
            gap={3}
            justifyContent={'center'}
            maxWidth={600}
            mt={6}
            mx={'auto'}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={back}
              sx={{ flex: 1 }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={disabledButton}
              onClick={(e) => handledPayment(e)}
              sx={{ flex: 1 }}
            >
              Pay now
            </StyledButton>
          </Stack>
        );
    }
  }, [
    back,
    backToList,
    disabledButton,
    handledPayment,
    handledSaveFormAndGetPaymentDetail,
    haveAppraisal,
    next,
    saveLoading,
    tableStatus,
  ]);

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            margin={'auto 0'}
            minHeight={'calc(667px - 46px)'}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : paymentStatus === DashboardTaskPaymentMethodsStatus.undone ? (
          <Transitions
            style={{
              width: '100%',
              maxWidth: 900,
            }}
          >
            {renderNode}
            {renderButton}
          </Transitions>
        ) : (
          <PaymentStatus paymentStatus={paymentStatus} />
        )}
      </Transitions>
    </>
  );
});
