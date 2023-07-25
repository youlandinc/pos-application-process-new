import { useCallback, useMemo, useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { IApplicationForm, IBpmn } from '@/models/base';
import { IBridgeStarting } from '@/models/application/bridge';
import { IWhereKnowUs } from '@/models/application/common/WhereKnowUs';
import { FixAndFlipPurchaseState, ServerTaskKey } from '@/types/enum';
import { useAutoSave, useStoreData } from '@/hooks';
import { _updateTask } from '@/requests';

import { Transitions } from '@/components/atoms';

import {
  Auth,
  FixCelebrate,
  FixCreditScore,
  FixPurchaseEstimateRate,
  FixRefuse,
  FixStarting,
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
        switch (state as FixAndFlipPurchaseState) {
          case FixAndFlipPurchaseState.starting:
            return (
              <FixStarting
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case FixAndFlipPurchaseState.auth:
            return (
              <Auth
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case FixAndFlipPurchaseState.creditScore:
            return (
              <FixCreditScore
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case FixAndFlipPurchaseState.whereKnowUs:
            return (
              <WhereKnow
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case FixAndFlipPurchaseState.estimateRate:
            return <FixPurchaseEstimateRate nextStep={next} />;
          case FixAndFlipPurchaseState.celebrate:
            return <FixCelebrate nextStep={next} />;
          case FixAndFlipPurchaseState.refuse:
            return <FixRefuse nextStep={next} />;
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
  const state = applicationForm.formData.state as FixAndFlipPurchaseState;
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
      FixAndFlipPurchaseState,
      {
        next: (cb?: () => void) => void;
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
              FixAndFlipPurchaseState.creditScore,
            );
          } else {
            applicationForm.formData.changeState(FixAndFlipPurchaseState.auth);
          }
        });
      },
      back: () => {
        handleBack();
      },
    },
    auth: {
      next: () => {
        applicationForm.formData.changeState(
          FixAndFlipPurchaseState.creditScore,
        );
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(
            FixAndFlipPurchaseState.starting,
          );
        });
        applicationForm.formData.changeState(FixAndFlipPurchaseState.starting);
      },
    },
    creditScore: {
      next: () => {
        applicationForm.formData.changeState(
          FixAndFlipPurchaseState.whereKnowUs,
        );
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(
            FixAndFlipPurchaseState.starting,
          );
        });
      },
    },
    whereKnowUs: {
      next: async () => {
        const postData = whereKnowUs.getPostData();
        await handledNextTask([postData], () => {
          applicationForm.formData.changeState(
            FixAndFlipPurchaseState.estimateRate,
          );
        });
      },
      back: async () => {
        await handledPrevTask(ServerTaskKey.about_other, () => {
          applicationForm.formData.changeState(
            FixAndFlipPurchaseState.creditScore,
          );
        });
      },
    },
    estimateRate: {
      next: async (cb) => {
        const { taskId } = bpmn;
        try {
          await _updateTask(taskId as string, 'complete');
          await applicationForm.formData.changeState(
            FixAndFlipPurchaseState.celebrate,
          );
        } catch (err) {
          enqueueSnackbar(err as string, {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
          });
        } finally {
          cb?.();
        }
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

export const FixPurchaseForm = observer((props: { handleBack: () => void }) => {
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
});
