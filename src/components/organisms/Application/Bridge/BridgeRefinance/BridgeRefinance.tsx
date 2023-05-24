import { useCallback, useMemo, useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { IApplicationForm, IBpmn, IUserSetting } from '@/models/base';
import { IBridgeStarting } from '@/models/application/bridge';
import { IWhereKnowUs } from '@/models/application/common/WhereKnowUs';

import { BridgeRefinanceState, ServerTaskKey } from '@/types/enum';
import { useAutoSave, useStoreData } from '@/hooks';
import { _updateTask } from '@/requests';

import { Transitions } from '@/components/atoms';

import {
  Auth,
  BridgeCelebrate,
  BridgeCreditScore,
  BridgeRefinanceEstimateRate,
  BridgeRefuse,
  BridgeStarting,
  WhereKnow,
} from '@/components/molecules/Application';

const useGenerateComponent = () => {
  const {
    applicationForm: {
      formData: { state },
    },
  } = useMst();

  const renderFormNode = useMemo(
    () =>
      (
        next: FormNodeBaseProps['nextStep'],
        back: FormNodeBaseProps['prevStep'],
        updateState: AsyncState,
        completeTaskState: AsyncState,
        changeTaskState: AsyncState,
      ) => {
        switch (state as BridgeRefinanceState) {
          case BridgeRefinanceState.starting:
            return (
              <BridgeStarting
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgeRefinanceState.auth:
            return (
              <Auth
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgeRefinanceState.creditScore:
            return (
              <BridgeCreditScore
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgeRefinanceState.whereKnowUs:
            return (
              <WhereKnow
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgeRefinanceState.estimateRate:
            return <BridgeRefinanceEstimateRate nextStep={next} />;
          case BridgeRefinanceState.celebrate:
            return <BridgeCelebrate nextStep={next} />;
          case BridgeRefinanceState.refuse:
            return <BridgeRefuse nextStep={next} />;
        }
      },
    [state],
  );

  return {
    renderFormNode,
  };
};

const useStateMachine = (
  applicationForm: IApplicationForm,
  session: UserSession,
  bpmn: IBpmn,
  handleBack: () => void,
  router: NextRouter,
  userSetting: IUserSetting,
) => {
  const state = applicationForm.formData.state as BridgeRefinanceState;
  const starting = applicationForm.formData.starting as IBridgeStarting;
  const whereKnowUs = applicationForm.formData.whereKnowUs as IWhereKnowUs;

  const { enqueueSnackbar } = useSnackbar();
  const {
    updateState,
    changeTaskState,
    completeTaskState,
    handledNextTask,
    handledPrevTask,
  } = useStoreData();
  const transitions = useRef<
    Record<
      BridgeRefinanceState,
      {
        next: () => void;
        back?: () => void;
      }
    >
  >({
    starting: {
      next: async () => {
        const postData = starting.getPostData();
        await handledNextTask([postData], () => {
          if (session) {
            applicationForm.formData.changeState(
              BridgeRefinanceState.creditScore,
            );
          } else {
            applicationForm.formData.changeState(BridgeRefinanceState.auth);
          }
        });
      },
      back: () => {
        handleBack();
      },
    },
    auth: {
      next: () => {
        applicationForm.formData.changeState(BridgeRefinanceState.creditScore);
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(ServerTaskKey.starting);
        });
        applicationForm.formData.changeState(ServerTaskKey.starting);
      },
    },
    creditScore: {
      next: () => {
        applicationForm.formData.changeState(BridgeRefinanceState.whereKnowUs);
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(ServerTaskKey.starting);
        });
      },
    },
    whereKnowUs: {
      next: async () => {
        const postData = whereKnowUs.getPostData();
        await handledNextTask([postData], () => {
          applicationForm.formData.changeState(
            BridgeRefinanceState.estimateRate,
          );
        });
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.about_yourself, () => {
          applicationForm.formData.changeState(
            BridgeRefinanceState.creditScore,
          );
        });
      },
    },
    estimateRate: {
      next: async () => {
        const { taskId } = bpmn;
        await _updateTask(taskId as string, 'complete')
          .then(() => {
            applicationForm.formData.changeState(
              BridgeRefinanceState.celebrate,
            );
          })
          .catch((err) => enqueueSnackbar(err));
      },
    },
    celebrate: {
      next: async () => {
        await userSetting.changeSettingField(
          'lastSelectedProcessId',
          bpmn.processId,
        );
        await router.push('/dashboard/overview');
      },
    },
    refuse: {
      next: async () => {
        await router.push('/');
      },
    },
  });

  const next = useCallback(() => {
    transitions.current[state].next();
  }, [state]);

  const back = useCallback(() => {
    transitions.current[state].back?.();
  }, [state]);

  return {
    updateState,
    changeTaskState,
    completeTaskState,
    next,
    back,
  };
};

export const BridgeRefinanceForm = observer(
  (props: { handleBack: () => void }) => {
    const { handleBack } = props;

    const router = useRouter();

    const { applicationForm, session, bpmn, userSetting } = useMst();

    const { next, back, updateState, changeTaskState, completeTaskState } =
      useStateMachine(
        applicationForm,
        session as UserSession,
        bpmn,
        handleBack,
        router,
        userSetting,
      );

    const { renderFormNode } = useGenerateComponent();

    useAutoSave(applicationForm.formData, bpmn);

    return (
      <Transitions
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          gap: 48,
          flexDirection: 'column',
        }}
      >
        {renderFormNode(
          next,
          back,
          updateState,
          completeTaskState,
          changeTaskState,
        )}
      </Transitions>
    );
  },
);
