import { FC, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useStoreData } from '@/hooks';
import { POSFindSpecificVariable, POSNotUndefined } from '@/utils';
import { IBridgeCreditScore } from '@/models/application/bridge';
import { IPersonalInfo } from '@/models/application/common/CreditScore';
import {
  BorrowerData,
  BridgeCreditScoreState,
  BridgePurchaseState,
  ServerTaskKey,
  VariableName,
} from '@/types';

import { StyledButton, StyledLoading } from '@/components/atoms';

const DynamicNotice = dynamic(
  () => import('./components/BridgeNotice').then((mod) => mod.BridgeNotice),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicPersonInfo = dynamic(
  () =>
    import('./components/BridgePersonInfo').then((mod) => mod.BridgePersonInfo),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicScore = dynamic(
  () =>
    import('./components/BridgeScoreResult').then(
      (mod) => mod.BridgeScoreResult,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicCoBorrowerInfo = dynamic(
  () =>
    import('./components/BridgeCoBorrowerInfo').then(
      (mod) => mod.BridgeCoBorrowerInfo,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const useStateMachine = (
  creditScore: IBridgeCreditScore,
  nextStep: FormNodeBaseProps['nextStep'],
  prevStep: FormNodeBaseProps['prevStep'],
) => {
  const {
    applicationForm: { formData },
  } = useMst();
  const { selfInfo, coBorrowerInfo } = creditScore;
  const {
    updateState,
    completeTaskState,
    changeTaskState,
    handledNextTask,
    handledPrevTask,
    bpmn,
    changeTask,
  } = useStoreData();

  const transitions = useMemo<{
    [state: string]: {
      next: () => void;
      back: () => void;
    };
  }>(
    () => ({
      notice: {
        next: () => {
          creditScore.changeState(BridgeCreditScoreState.selfInfo);
        },
        back: () => {
          prevStep();
        },
      },
      selfInfo: {
        next: async () => {
          selfInfo.validateSelfInfo();
          if (selfInfo.isValid) {
            await handledNextTask(
              [
                {
                  ...selfInfo.getPostData(),
                  name: VariableName.aboutUSelf,
                },
              ],
              async (nextTask) => {
                const { variables } = nextTask.extra;
                const _borrower = POSFindSpecificVariable<BorrowerData>(
                  VariableName._borrower,
                  variables,
                );
                (selfInfo as IPersonalInfo).changeSelfInfo(
                  'creditScore',
                  _borrower?.value.creditScore,
                );
                if (
                  _borrower?.value.creditScore &&
                  _borrower?.value.creditScore <= 640
                ) {
                  await changeTask(ServerTaskKey.refuse, bpmn.taskId);
                  formData.changeState(BridgePurchaseState.refuse);
                  return;
                }
                creditScore.changeState(BridgeCreditScoreState.creditScore);
              },
            );
          }
        },
        back: () => {
          creditScore.changeState(BridgeCreditScoreState.notice);
        },
      },
      creditScore: {
        next: () => {
          creditScore.changeState(BridgeCreditScoreState.coBorrowerInfo);
        },
        back: async () => {
          await handledPrevTask(ServerTaskKey.about_yourself, () =>
            creditScore.changeState(BridgeCreditScoreState.selfInfo),
          );
        },
      },
      coBorrowerInfo: {
        next: async () => {
          const postData = creditScore.getCoborrowerConditionPostData();
          await handledNextTask(
            [
              postData,
              {
                ...coBorrowerInfo.getPostData(),
                name: VariableName.aboutOtherInfo,
              },
            ],
            () => nextStep(),
          );
        },
        back: async () => {
          await handledPrevTask(ServerTaskKey.about_yourself, () => {
            creditScore.changeState(BridgeCreditScoreState.creditScore);
          });
        },
      },
    }),
    [
      creditScore,
      prevStep,
      selfInfo,
      handledNextTask,
      changeTask,
      bpmn.taskId,
      formData,
      handledPrevTask,
      coBorrowerInfo,
      nextStep,
    ],
  );
  const next = useCallback(() => {
    transitions[creditScore.state].next();
  }, [creditScore.state, transitions]);

  const back = useCallback(() => {
    transitions[creditScore.state].back();
  }, [creditScore.state, transitions]);

  return {
    next,
    back,
    updateState,
    changeTaskState,
    completeTaskState,
  };
};

export const BridgeCreditScore: FC<FormNodeBaseProps> = observer((props) => {
  const {
    prevStep,
    nextStep,
    changeTaskState: prevTaskState,
    completeTaskState: nextTaskState,
    updateState: storeDataState,
  } = props;
  const {
    applicationForm: { formData },
  } = useMst();

  const creditScore = formData.creditScore as IBridgeCreditScore;
  const { next, back, updateState, changeTaskState, completeTaskState } =
    useStateMachine(creditScore, nextStep, prevStep);
  const renderFormNodeStep = useMemo(() => {
    switch (creditScore.state) {
      case BridgeCreditScoreState.notice:
        return <DynamicNotice />;
      case BridgeCreditScoreState.selfInfo:
        return <DynamicPersonInfo />;
      case BridgeCreditScoreState.creditScore:
        return <DynamicScore role={'self'} />;
      case BridgeCreditScoreState.coBorrowerInfo:
        return <DynamicCoBorrowerInfo />;
    }
  }, [creditScore.state]);

  const checkIsDisabled = useMemo(() => {
    switch (creditScore.state) {
      case BridgeCreditScoreState.notice:
      case BridgeCreditScoreState.creditScore:
        return false;
      case BridgeCreditScoreState.selfInfo:
        return creditScore.selfInfo.checkValueIsEmpty;
      case BridgeCreditScoreState.coBorrowerInfo:
        if (!POSNotUndefined(creditScore.coBorrowerCondition.isCoBorrower)) {
          return true;
        }
        return creditScore.coBorrowerCondition.isCoBorrower
          ? creditScore.coBorrowerInfo.checkValueIsEmpty
          : false;
    }
  }, [
    creditScore.coBorrowerCondition.isCoBorrower,
    creditScore.coBorrowerInfo.checkValueIsEmpty,
    creditScore.selfInfo.checkValueIsEmpty,
    creditScore.state,
  ]);

  return (
    <>
      {renderFormNodeStep}
      <Stack
        alignItems={'center'}
        flex={1}
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          disabled={
            changeTaskState.loading ||
            prevTaskState.loading ||
            nextTaskState.loading ||
            completeTaskState.loading ||
            updateState.loading ||
            storeDataState.loading
          }
          loading={changeTaskState.loading || prevTaskState.loading}
          onClick={back}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton
          disabled={
            changeTaskState.loading ||
            prevTaskState.loading ||
            nextTaskState.loading ||
            completeTaskState.loading ||
            updateState.loading ||
            storeDataState.loading ||
            checkIsDisabled
          }
          loading={
            nextTaskState.loading ||
            completeTaskState.loading ||
            updateState.loading ||
            storeDataState.loading
          }
          onClick={next}
          sx={{ flex: 1 }}
        >
          Next
        </StyledButton>
      </Stack>
    </>
  );
});
