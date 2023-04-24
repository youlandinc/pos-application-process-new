import React, { useCallback, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';

import dynamic from 'next/dynamic';
import { NextRouter, useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { IApplicationForm, IBpmn, IUserSetting } from '@/models/base';
import { IBridgeStarting } from '@/models/application/bridge';
import { IWhereKnowUs } from '@/models/application/common/WhereKnowUs';

import { BridgePurchaseState, ServerTaskKey } from '@/types/enum';
import { useAutoSave, useStoreData } from '@/hooks';
import { _updateTask } from '@/requests';

import { StyledLoading } from '@/components/atoms';

const DynamicStarting = dynamic(
  () =>
    import('@/components/molecules/Application/Bridge/Common').then(
      (mod) => mod.BridgeStarting,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicAuth = dynamic(
  () =>
    import('@/components/molecules/Application/Common/Auth').then(
      (mod) => mod.Auth,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicCreditScore = dynamic(
  () =>
    import('@/components/molecules/Application/Bridge/Common').then(
      (mod) => mod.BridgeCreditScore,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicWhereKnow = dynamic(
  () =>
    import('@/components/molecules/Application/Common').then(
      (mod) => mod.WhereKnow,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicEstimateRate = dynamic(
  () =>
    import('@/components/molecules/Application/Bridge/Purchase').then(
      (mod) => mod.BPEstimateRate,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicCelebrate = dynamic(
  () =>
    import('@/components/molecules/Application/Bridge/Common').then(
      (mod) => mod.BridgeCelebrate,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

const DynamicRefuse = dynamic(
  () =>
    import('@/components/molecules/Application/Bridge/Common').then(
      (mod) => mod.BridgeRefuse,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

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
              <DynamicStarting
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.auth:
            return (
              <DynamicAuth
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.creditScore:
            return (
              <DynamicCreditScore
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.whereKnowUs:
            return (
              <DynamicWhereKnow
                changeTaskState={changeTaskState}
                completeTaskState={completeTaskState}
                nextStep={next}
                prevStep={back}
                updateState={updateState}
              />
            );
          case BridgePurchaseState.estimateRate:
            return <DynamicEstimateRate nextStep={next} />;
          case BridgePurchaseState.celebrate:
            return <DynamicCelebrate nextStep={next} />;
          case BridgePurchaseState.refuse:
            return <DynamicRefuse nextStep={next} />;
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
  const state = applicationForm.formData.state as BridgePurchaseState;
  const starting = applicationForm.formData.starting as IBStarting;
  const whereKnowUs = applicationForm.formData.whereKnowUs as IWhereKnowUs;

  const { enqueueSnackbar } = useSnackbar();
  const {
    updateState,
    changeTaskState,
    completeTaskState,
    handleNextTask,
    handlePrevTask,
    changeTask,
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
        await handleNextTask([postData], () => {
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
        await handlePrevTask(ServerTaskKey.starting, () => {
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
        await handlePrevTask(ServerTaskKey.starting, () => {
          applicationForm.formData.changeState(BridgePurchaseState.starting);
        });
      },
    },
    whereKnowUs: {
      next: async () => {
        const postData = whereKnowUs.getPostData();
        await handleNextTask([postData], () => {
          applicationForm.formData.changeState(
            BridgePurchaseState.estimateRate,
          );
        });
      },
      back: async () => {
        await handlePrevTask(ServerTaskKey.about_yourself, () => {
          applicationForm.formData.changeState(BridgePurchaseState.creditScore);
        });
      },
    },
    estimateRate: {
      next: async () => {
        const { taskId } = bpmn;
        await _updateTask(taskId, 'complete')
          .then(() => {
            applicationForm.formData.changeState(BridgePurchaseState.celebrate);
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
    transitions.current[state].back();
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

    const { applicationForm, session, bpmn, userSetting } = useMst();

    const { next, back, updateState, changeTaskState, completeTaskState } =
      useStateMachine(
        applicationForm,
        session,
        bpmn,
        handleBack,
        router,
        userSetting,
      );

    const { renderFormNode } = useGenerateComponent();

    useAutoSave(applicationForm.formData, bpmn);

    return (
      <Box style={{ padding: '120px 7.5vw' }}>
        {renderFormNode(
          next,
          back,
          updateState,
          completeTaskState,
          changeTaskState,
        )}
      </Box>
    );
  },
);