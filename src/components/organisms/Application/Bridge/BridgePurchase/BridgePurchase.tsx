import { useCallback, useMemo, useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { IApplicationForm, IBpmn } from '@/models/base';
import { IBridgeStarting } from '@/models/application/bridge';
import { IWhereKnowUs } from '@/models/application/common/WhereKnowUs';

import { BridgePurchaseState, ServerTaskKey } from '@/types/enum';
import { useAutoSave, useStoreData } from '@/hooks';
import { _updateTask } from '@/requests';

import { Transitions } from '@/components/atoms';

import {
  Auth,
  BridgeCelebrate,
  BridgeCreditScore,
  BridgePurchaseEstimateRate,
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
        switch (state as BridgePurchaseState) {
          case BridgePurchaseState.starting:
            return (
              <BridgeStarting
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.auth:
            return (
              <Auth
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.creditScore:
            return (
              <BridgeCreditScore
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.whereKnowUs:
            return (
              <WhereKnow
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.estimateRate:
            return <BridgePurchaseEstimateRate nextStep={next} />;
          case BridgePurchaseState.celebrate:
            return <BridgeCelebrate nextStep={next} />;
          case BridgePurchaseState.refuse:
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
) => {
  const state = applicationForm.formData.state as BridgePurchaseState;
  const starting = applicationForm.formData.starting as IBridgeStarting;
  const whereKnowUs = applicationForm.formData.whereKnowUs as IWhereKnowUs;

  const { enqueueSnackbar } = useSnackbar();
  const {
    updateState,
    changeTaskState,
    completeTaskState,
    handledNextTask,
    handledPrevTask,
    // changeTask,
  } = useStoreData();

  const transitions = useRef<
    Record<
      BridgePurchaseState,
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
              BridgePurchaseState.creditScore,
            );
          } else {
            applicationForm.formData.changeState(BridgePurchaseState.auth);
          }
        });
      },
      back: () => {
        handleBack();
      },
    },
    auth: {
      next: () => {
        applicationForm.formData.changeState(BridgePurchaseState.creditScore);
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(BridgePurchaseState.starting);
        });
        applicationForm.formData.changeState(BridgePurchaseState.starting);
      },
    },
    creditScore: {
      next: () => {
        applicationForm.formData.changeState(BridgePurchaseState.whereKnowUs);
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(BridgePurchaseState.starting);
        });
      },
    },
    whereKnowUs: {
      next: async () => {
        const postData = whereKnowUs.getPostData();
        await handledNextTask([postData], () => {
          applicationForm.formData.changeState(
            BridgePurchaseState.estimateRate,
          );
        });
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.about_other, () => {
          applicationForm.formData.changeState(BridgePurchaseState.creditScore);
        });
      },
    },
    estimateRate: {
      next: async () => {
        const { taskId } = bpmn;
        await _updateTask(taskId as string, 'complete')
          .then(() => {
            applicationForm.formData.changeState(BridgePurchaseState.celebrate);
          })
          .catch((err) => enqueueSnackbar(err));
      },
    },
    celebrate: {
      next: async () => {
        await router.push({
          pathname: '/dashboard/overview',
          query: { processId: bpmn.processId },
        });
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

export const BridgePurchaseForm = observer(
  (props: { handleBack: () => void }) => {
    const { handleBack } = props;

    const router = useRouter();

    const { applicationForm, session, bpmn } = useMst();

    const { next, back, updateState, changeTaskState, completeTaskState } =
      useStateMachine(
        applicationForm,
        session as UserSession,
        bpmn,
        handleBack,
        router,
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
