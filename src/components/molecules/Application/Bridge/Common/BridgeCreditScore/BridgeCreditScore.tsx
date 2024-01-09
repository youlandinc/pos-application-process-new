import { FC, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useStoreData } from '@/hooks';
import { IBridgeCreditScore } from '@/models/application/bridge';
import { IPersonalInfo } from '@/models/application/common/CreditScore';
import {
  BorrowerData,
  BridgeCreditScoreState,
  CommonBorrowerType,
  SelfInfoData,
  ServerTaskKey,
  SoftCreditRequirementEnum,
  VariableName,
} from '@/types';
import { POSFindSpecificVariable, POSNotUndefined } from '@/utils';

import { StyledButton } from '@/components/atoms';

import {
  BridgeCoBorrowerInfo,
  BridgeNotice,
  BridgePersonInfo,
  BridgeScoreResult,
} from './components';

const useStateMachine = (
  creditScore: IBridgeCreditScore,
  nextStep: FormNodeBaseProps['nextStep'],
  prevStep: FormNodeBaseProps['prevStep'],
) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const { selfInfo, coBorrowerInfo } = creditScore;
  const {
    updateState,
    completeTaskState,
    changeTaskState,
    handledNextTask,
    handledPrevTask,
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
                  selfInfo.citizenship === CommonBorrowerType.foreign_national
                ) {
                  creditScore.changeState(
                    BridgeCreditScoreState.coBorrowerInfo,
                  );
                  return;
                }
                if (
                  saasState?.posSettings?.softCreditRequirement ===
                    SoftCreditRequirementEnum.optional &&
                  selfInfo.isSkipCheck
                ) {
                  creditScore.changeState(
                    BridgeCreditScoreState.coBorrowerInfo,
                  );
                  return;
                }
                //if (
                //  _borrower?.value.creditScore &&
                //  _borrower?.value.creditScore <= 640
                //) {
                //  await changeTask(ServerTaskKey.refuse, bpmn.taskId);
                //  formData.changeState(BridgePurchaseState.refuse);
                //  return;
                //}
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
          const params: any[] = [postData];
          if (creditScore.coBorrowerCondition.isCoBorrower) {
            coBorrowerInfo.validateSelfInfo('coBorrower');
            if (coBorrowerInfo.isValid) {
              params.push({
                name: VariableName.aboutOtherInfo,
                ...coBorrowerInfo.getPostData(),
              });
            }
          }
          await handledNextTask(params, () => nextStep());
        },
        back: async () => {
          await handledPrevTask(ServerTaskKey.about_yourself, (prevTask) => {
            const { variables } = prevTask.extra;
            const aboutUSelf = POSFindSpecificVariable<SelfInfoData>(
              VariableName.aboutUSelf,
              variables,
            );
            const {
              value: { citizenship },
            } = aboutUSelf as Variable<SelfInfoData>;
            if (
              citizenship === CommonBorrowerType.foreign_national ||
              (saasState?.posSettings?.softCreditRequirement ===
                SoftCreditRequirementEnum.optional &&
                selfInfo.isSkipCheck)
            ) {
              creditScore.changeState(BridgeCreditScoreState.selfInfo);
              return;
            }
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
      saasState?.posSettings?.softCreditRequirement,
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
        return <BridgeNotice />;
      case BridgeCreditScoreState.selfInfo:
        return <BridgePersonInfo />;
      case BridgeCreditScoreState.creditScore:
        return <BridgeScoreResult role={'self'} />;
      case BridgeCreditScoreState.coBorrowerInfo:
        return <BridgeCoBorrowerInfo />;
    }
  }, [creditScore.state]);

  const checkIsDisabled = useMemo(() => {
    switch (creditScore.state) {
      case BridgeCreditScoreState.notice:
      case BridgeCreditScoreState.creditScore:
        return false;
      case BridgeCreditScoreState.selfInfo:
        return creditScore.selfInfo.checkSelfValueIsDisabled;
      case BridgeCreditScoreState.coBorrowerInfo:
        if (!POSNotUndefined(creditScore.coBorrowerCondition.isCoBorrower)) {
          return true;
        }
        return creditScore.coBorrowerCondition.isCoBorrower
          ? creditScore.coBorrowerInfo.checkOtherValueIsEmpty
          : false;
    }
  }, [
    creditScore.coBorrowerCondition.isCoBorrower,
    creditScore.coBorrowerInfo.checkOtherValueIsEmpty,
    creditScore.selfInfo.checkSelfValueIsDisabled,
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
