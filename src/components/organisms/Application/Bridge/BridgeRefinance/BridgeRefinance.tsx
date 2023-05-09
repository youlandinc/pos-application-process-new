import { useCallback, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
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

import { StyledLoading } from '@/components/atoms';

//const DynamicStarting = dynamic(
//  () =>
//    import('@/components/molecules/Application/Bridge/Common').then(
//      (mod) => mod.BridgeStarting,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicAuth = dynamic(
//  () =>
//    import('@/components/molecules/Application/Common/Auth').then(
//      (mod) => mod.Auth,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicCreditScore = dynamic(
//  () =>
//    import('@/components/molecules/Application/Bridge/Common').then(
//      (mod) => mod.BridgeCreditScore,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicWhereKnow = dynamic(
//  () =>
//    import('@/components/molecules/Application/Common').then(
//      (mod) => mod.WhereKnow,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicEstimateRate = dynamic(
//  () =>
//    import('@/components/molecules/Application/Bridge/Refinance').then(
//      (mod) => mod.BREstimateRate,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicCelebrate = dynamic(
//  () =>
//    import('@/components/molecules/Application/Bridge/Common').then(
//      (mod) => mod.BridgeCelebrate,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const DynamicRefuse = dynamic(
//  () =>
//    import('@/components/molecules/Application/Bridge/Common').then(
//      (mod) => mod.BridgeRefuse,
//    ),
//  {
//    loading: () => <StyledLoading />,
//  },
//);
//
//const useGenerateComponent = () => {
//  const {
//    applicationForm: {
//      formData: { state },
//    },
//  } = useMst();
//
//  const renderFormNode = useMemo(
//    () =>
//      (
//        next: FormNodeBaseProps['nextStep'],
//        back: FormNodeBaseProps['prevStep'],
//        updateState: AsyncState,
//        completeTaskState: AsyncState,
//        changeTaskState: AsyncState,
//      ) => {
//        switch (state as BridgeRefinanceState) {
//          case BridgeRefinanceState.starting:
//            return (
//              <DynamicStarting
//                changeTaskState={changeTaskState}
//                completeTaskState={completeTaskState}
//                nextStep={next}
//                prevStep={back}
//                updateState={updateState}
//              />
//            );
//          case BridgeRefinanceState.auth:
//            return (
//              <DynamicAuth
//                changeTaskState={changeTaskState}
//                completeTaskState={completeTaskState}
//                nextStep={next}
//                prevStep={back}
//                updateState={updateState}
//              />
//            );
//          case BridgeRefinanceState.creditScore:
//            return (
//              <DynamicCreditScore
//                changeTaskState={changeTaskState}
//                completeTaskState={completeTaskState}
//                nextStep={next}
//                prevStep={back}
//                updateState={updateState}
//              />
//            );
//          case BridgeRefinanceState.whereKnowUs:
//            return (
//              <DynamicWhereKnow
//                changeTaskState={changeTaskState}
//                completeTaskState={completeTaskState}
//                nextStep={next}
//                prevStep={back}
//                updateState={updateState}
//              />
//            );
//          case BridgeRefinanceState.estimateRate:
//            return <DynamicEstimateRate nextStep={next} />;
//          case BridgeRefinanceState.celebrate:
//            return <DynamicCelebrate nextStep={next} />;
//          case BridgeRefinanceState.refuse:
//            return <DynamicRefuse nextStep={next} />;
//        }
//      },
//    [state],
//  );
//
//  return {
//    renderFormNode,
//  };
//};
//
//const useStateMachine = (
//  applicationForm: IApplicationForm,
//  session: UserSession,
//  bpmn: IBpmn,
//  handleBack: () => void,
//  router: NextRouter,
//  userSetting: IUserSetting,
//) => {
//  const state = applicationForm.formData.state as BridgeRefinanceState;
//  const starting = applicationForm.formData.starting as IBridgeStarting;
//  const whereKnowUs = applicationForm.formData.whereKnowUs as IWhereKnowUs;
//
//  const { enqueueSnackbar } = useSnackbar();
//  const {
//    updateState,
//    changeTaskState,
//    completeTaskState,
//    handleNextTask,
//    handlePrevTask,
//    changeTask,
//  } = useStoreData();
//  const transitions = useRef<
//    Record<
//      BridgeRefinanceState,
//      {
//        next: () => void;
//        back?: () => void;
//      }
//    >
//  >({
//    starting: {
//      next: async () => {
//        const postData = starting.getPostData();
//        await handleNextTask([postData], () => {
//          if (session) {
//            applicationForm.formData.changeState(
//              BridgeRefinanceState.creditScore,
//            );
//          } else {
//            applicationForm.formData.changeState(BridgeRefinanceState.auth);
//          }
//        });
//      },
//      back: () => {
//        handleBack();
//      },
//    },
//    auth: {
//      next: () => {
//        applicationForm.formData.changeState(BridgeRefinanceState.creditScore);
//      },
//      back: async () => {
//        await handlePrevTask(ServerTaskKey.starting, () => {
//          applicationForm.formData.changeState(ServerTaskKey.starting);
//        });
//        applicationForm.formData.changeState(ServerTaskKey.starting);
//      },
//    },
//    creditScore: {
//      next: () => {
//        applicationForm.formData.changeState(BridgeRefinanceState.whereKnowUs);
//      },
//      back: async () => {
//        await handlePrevTask(ServerTaskKey.starting, () => {
//          applicationForm.formData.changeState(ServerTaskKey.starting);
//        });
//      },
//    },
//    whereKnowUs: {
//      next: async () => {
//        const postData = whereKnowUs.getPostData();
//        await handleNextTask([postData], () => {
//          applicationForm.formData.changeState(
//            BridgeRefinanceState.estimateRate,
//          );
//        });
//      },
//      back: async () => {
//        await handlePrevTask(ServerTaskKey.about_yourself, () => {
//          applicationForm.formData.changeState(
//            BridgeRefinanceState.creditScore,
//          );
//        });
//      },
//    },
//    estimateRate: {
//      next: async () => {
//        const { taskId } = bpmn;
//        await _updateTask(taskId, 'complete')
//          .then(() => {
//            applicationForm.formData.changeState(
//              BridgeRefinanceState.celebrate,
//            );
//          })
//          .catch((err) => enqueueSnackbar(err));
//      },
//    },
//    celebrate: {
//      next: async () => {
//        await userSetting.changeSettingField(
//          'lastSelectedProcessId',
//          bpmn.processId,
//        );
//        await router.push('/dashboard/overview');
//      },
//    },
//    refuse: {
//      next: async () => {
//        await router.push('/');
//      },
//    },
//  });
//
//  const next = useCallback(() => {
//    transitions.current[state].next();
//  }, [state]);
//
//  const back = useCallback(() => {
//    transitions.current[state].back();
//  }, [state]);
//
//  return {
//    updateState,
//    changeTaskState,
//    completeTaskState,
//    next,
//    back,
//  };
//};

export const BridgeRefinanceForm = observer(
  (props: { handleBack: () => void }) => {
    //const { handleBack } = props;
    //
    //const router = useRouter();
    //
    //const { applicationForm, session, bpmn, userSetting } = useMst();
    //
    //const { next, back, updateState, changeTaskState, completeTaskState } =
    //  useStateMachine(
    //    applicationForm,
    //    session,
    //    bpmn,
    //    handleBack,
    //    router,
    //    userSetting,
    //  );
    //
    //const { renderFormNode } = useGenerateComponent();

    //useAutoSave(applicationForm.formData, bpmn);

    return (
      <Box>
        refinance
        {/*{renderFormNode(*/}
        {/*  next,*/}
        {/*  back,*/}
        {/*  updateState,*/}
        {/*  completeTaskState,*/}
        {/*  changeTaskState,*/}
        {/*)}*/}
      </Box>
    );
  },
);
