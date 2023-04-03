import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { ApplicationForm } from './ApplicationForm';
import { Bpmn } from '@/models/Bpmn';
import { NotificationStation } from '@/models/NotificationStation';
import { LoginType, ServerTaskKey, UserType } from '@/types/enum';
import { DetectUserActiveService } from '@/models/DetectUserActiveService';
import { UserSetting } from '@/models/UserSetting';
import { SelectedProcessData } from '@/models/SelectedProcessData';
import { DashboardTask } from '@/models/DashboardTask';
import { PipelineTaskForm } from './PipelineTaskForm';
import Router from 'next/router';
import { STaskItemStatus } from '@/requests/dashboard';
import { User } from '@/types/user';
import { userpool } from '@/common/userpool';

export const RootModel = {
  persistDataLoaded: types.boolean,
  loadedGoogle: types.boolean,
  applicationForm: ApplicationForm,
  bpmn: Bpmn,
  userProfile: types.maybe(types.frozen<ClientUserProfile>()),
  notificationStation: NotificationStation,
  session: types.maybe(types.frozen<UserSession>()),
  detectUserActiveService: DetectUserActiveService,
  userSetting: UserSetting,
  selectedProcessData: SelectedProcessData,
  dashboardTask: DashboardTask,
  pipelineTask: PipelineTaskForm,
  userType: types.maybe(
    types.union(
      types.literal(UserType.CUSTOMER),
      types.literal(UserType.BROKER),
      types.literal(UserType.REAL_ESTATE_AGENT),
      types.literal(UserType.LOAN_OFFICER),
    ),
  ),
  loginType: types.maybe(
    types.union(
      types.literal(LoginType.YLACCOUNT_LOGIN),
      types.literal(LoginType.GOOGLE_LOGIN),
    ),
  ),
};

const RootStore = types.model(RootModel).actions((self) => {
  return {
    injectCognitoUserSession(session: User.UserSignInRequest) {
      self.session = {
        accessToken: {
          jwtToken: session.accessToken,
        },
        idToken: {
          jwtToken: session.accessToken,
        },
        refreshToken: {
          token: session.refreshToken,
        },
      };
    },
    injectCognitoUserProfile(profile: User.UserSignInRequest) {
      self.userProfile = {
        username: profile.userProfile.name,
        email: profile.userProfile.email,
        userType: profile.userProfile.userType,
        loginType: profile.userProfile.loginType,
      };
    },
    injectSimpleUserProfile(profile: (typeof self)['userProfile']) {
      self.userProfile = { ...profile };
    },
    updateSession(session: UserSession | undefined) {
      self.session = session;
    },
    updateProfile(profile: ClientUserProfile | undefined) {
      self.userProfile = profile;
    },
    updateProfileAttribute(name: keyof ClientUserProfile, value: unknown) {
      self.userProfile = { ...self.userProfile, [name]: value };
    },
    updateUserType(value: UserType) {
      self.userType = value;
    },
    updateLoginType(value: LoginType) {
      self.loginType = value;
    },
    setLoadedGoogle() {
      self.loadedGoogle = true;
    },
    setPersistDataLoaded() {
      self.persistDataLoaded = true;
    },
    logout(isMemo = true) {
      if (Router.pathname === '/auth/sign_in') {
        return;
      }
      this.updateSession();
      this.updateProfile();
      self.userSetting.setUserSetting({ lastSelectedProcessId: undefined });
      self.detectUserActiveService.setDetectUserActiveService(void 0);
      const lastAuthId = userpool.getLastAuthUserId();
      if (lastAuthId) {
        userpool.clearLastAuthUserInfo(lastAuthId);
        userpool.clearLastAuthUserToken(lastAuthId);
      }
      window.location.href = '/auth/sign_in';
    },
  };
});

const initialState = {
  loadedGoogle: false,
  applicationForm: {
    initialized: false,
  },
  userProfile: void 0,
  session: void 0,
  notificationStation: {
    notifications: [],
  },
  bpmn: {
    processId: '',
    taskId: '',
    ServerTaskKey: ServerTaskKey.starting,
    variables: [{}],
  },
  detectUserActiveService: {
    instance: void 0,
  },
  userSetting: {
    initialized: false,
    loading: false,
    setting: {
      lastSelectedProcessId: '',
    },
  },
  selectedProcessData: {
    data: void 0,
    scene: '' as SceneType,
    loading: false,
  },
  persistDataLoaded: false,
  dashboardTask: {
    paymentStatus: 'undone' as STaskItemStatus,
    taskInitialized: false,
  },
  pipelineTask: {
    pipelineInitialized: false,
  },
  userType: undefined,
  isGoogleUser: undefined,
};

export const rootStore = RootStore.create(initialState);

export type RootInstance = Instance<typeof RootStore>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;

export const useMst = () => {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
