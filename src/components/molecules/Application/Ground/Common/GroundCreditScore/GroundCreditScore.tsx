import { FC, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useStoreData } from '@/hooks';
import { POSFindSpecificVariable, POSNotUndefined } from '@/utils';
import { IGroundCreditScore } from '@/models/application/ground';
import { IPersonalInfo } from '@/models/application/common/CreditScore';
import {
  BorrowerData,
  CommonBorrowerType,
  GroundUpConstructionCreditScoreState,
  //GroundUpConstructionPurchaseState,
  SelfInfoData,
  ServerTaskKey,
  SoftCreditRequirementEnum,
  VariableName,
} from '@/types';

import { StyledButton } from '@/components/atoms';

import {
  GroundCoBorrowerInfo,
  GroundNotice,
  GroundPersonInfo,
  GroundScoreResult,
} from './components';

const useStateMachine = (
  creditScore: IGroundCreditScore,
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
          creditScore.changeState(
            GroundUpConstructionCreditScoreState.selfInfo,
          );
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
                    GroundUpConstructionCreditScoreState.coBorrowerInfo,
                  );
                  return;
                }
                if (
                  saasState?.posSettings?.softCreditRequirement ===
                    SoftCreditRequirementEnum.optional &&
                  selfInfo.isSkipCheck
                ) {
                  creditScore.changeState(
                    GroundUpConstructionCreditScoreState.coBorrowerInfo,
                  );
                  return;
                }
                //if (
                //  _borrower?.value.creditScore &&
                //  _borrower?.value.creditScore <= 640
                //) {
                //  await changeTask(ServerTaskKey.refuse, bpmn.taskId);
                //  formData.changeState(
                //    GroundUpConstructionPurchaseState.refuse,
                //  );
                //  return;
                //}
                creditScore.changeState(
                  GroundUpConstructionCreditScoreState.creditScore,
                );
              },
            );
          }
        },
        back: () => {
          creditScore.changeState(GroundUpConstructionCreditScoreState.notice);
        },
      },
      creditScore: {
        next: () => {
          creditScore.changeState(
            GroundUpConstructionCreditScoreState.coBorrowerInfo,
          );
        },
        back: async () => {
          await handledPrevTask(ServerTaskKey.about_yourself, () =>
            creditScore.changeState(
              GroundUpConstructionCreditScoreState.selfInfo,
            ),
          );
        },
      },
      coBorrowerInfo: {
        next: async () => {
          const postData = creditScore.getCoborrowerConditionPostData();
          const params: any[] = [postData];
          if (creditScore.coBorrowerCondition.isCoBorrower) {
            coBorrowerInfo.validateSelfInfo('coBorrower');
            if (!coBorrowerInfo.isValid) {
              return;
            }
            params.push({
              name: VariableName.aboutOtherInfo,
              ...coBorrowerInfo.getPostData(),
            });
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
              creditScore.changeState(
                GroundUpConstructionCreditScoreState.selfInfo,
              );
              return;
            }
            creditScore.changeState(
              GroundUpConstructionCreditScoreState.creditScore,
            );
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

export const GroundCreditScore: FC<FormNodeBaseProps> = observer((props) => {
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

  const creditScore = formData.creditScore as IGroundCreditScore;
  const { next, back, updateState, changeTaskState, completeTaskState } =
    useStateMachine(creditScore, nextStep, prevStep);
  const renderFormNodeStep = useMemo(() => {
    switch (creditScore.state) {
      case GroundUpConstructionCreditScoreState.notice:
        return <GroundNotice />;
      case GroundUpConstructionCreditScoreState.selfInfo:
        return <GroundPersonInfo />;
      case GroundUpConstructionCreditScoreState.creditScore:
        return <GroundScoreResult role={'self'} />;
      case GroundUpConstructionCreditScoreState.coBorrowerInfo:
        return <GroundCoBorrowerInfo />;
    }
  }, [creditScore.state]);

  const checkIsDisabled = useMemo(() => {
    switch (creditScore.state) {
      case GroundUpConstructionCreditScoreState.notice:
      case GroundUpConstructionCreditScoreState.creditScore:
        return false;
      case GroundUpConstructionCreditScoreState.selfInfo:
        return creditScore.selfInfo.checkSelfValueIsDisabled;
      case GroundUpConstructionCreditScoreState.coBorrowerInfo:
        if (!POSNotUndefined(creditScore.coBorrowerCondition.isCoBorrower)) {
          return true;
        }
        return creditScore.coBorrowerCondition.isCoBorrower
          ? creditScore.coBorrowerInfo.checkOtherValueIsDisabled
          : false;
    }
  }, [
    creditScore.coBorrowerCondition.isCoBorrower,
    creditScore.coBorrowerInfo.checkOtherValueIsDisabled,
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
