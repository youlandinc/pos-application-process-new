import { createContext, useContext } from 'react';
import Router from 'next/router';

import { Instance, types } from 'mobx-state-tree';

import {
  ApplicationForm,
  Bpmn,
  DetectUserActiveService,
  NotificationStation,
  PTaskForm,
  SelectedProcessData,
  UserSetting,
  //UserConfig,
  //UserProfile
} from './base';

import {
  LoanStage,
  LoginType,
  SceneType,
  ServerTaskKey,
  UserType,
} from '@/types/enum';
import { User } from '@/types/user';

import { userpool } from '@/constants';

export const RootModel = {
  persistDataLoaded: types.boolean,
  loadedGoogle: types.boolean,

  bpmn: Bpmn,
  selectedProcessData: SelectedProcessData,

  applicationForm: ApplicationForm,

  pipelineTask: PTaskForm,

  session: types.maybe(types.frozen<UserSession>()),
  userSetting: UserSetting,
  userProfile: types.maybe(types.frozen<ClientUserProfile>()),

  // todo: need extract to user model
  // useConfig:UserConfig,
  // UserProfile: UserProfile,
  userType: types.maybe(
    types.union(
      types.literal(UserType.CUSTOMER),
      types.literal(UserType.BROKER),
      types.literal(UserType.REAL_ESTATE_AGENT),
      types.literal(UserType.LOAN_OFFICER),
      types.literal(UserType.LENDER),
    ),
  ),
  loginType: types.maybe(
    types.union(
      types.literal(LoginType.YLACCOUNT_LOGIN),
      types.literal(LoginType.GOOGLE_LOGIN),
      types.literal(LoginType.DEFAULT),
    ),
  ),

  detectUserActiveService: DetectUserActiveService,
  notificationStation: NotificationStation,
};

const RootStore = types.model(RootModel).actions((self) => {
  return {
    injectCognitoUserSession(session: User.UserRefreshTokenRequest) {
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
    injectSimpleUserProfile(profile: ClientUserProfile) {
      self.userProfile = { ...profile };
    },
    updateSession(session?: UserSession) {
      self.session = session;
    },
    updateProfile(profile?: ClientUserProfile) {
      self.userProfile = profile;
    },
    updateProfileAttribute(
      name: keyof (typeof self)['userProfile'],
      value: unknown,
    ) {
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
    resetApplicationForm() {
      self.applicationForm.resetForm();
    },
    logout() {
      if (Router.pathname === '/auth/sign_in') {
        return;
      }
      this.updateSession();
      this.updateProfile();
      self.detectUserActiveService.setDetectUserActiveService(void 0);
      const lastAuthId = userpool.getLastAuthUserId();
      if (lastAuthId) {
        userpool.clearLastAuthUserInfo(lastAuthId);
        userpool.clearLastAuthUserToken(lastAuthId);
      }
      window.location.href = '/auth/login';
    },
  };
});

const initialState = {
  loadedGoogle: false,
  persistDataLoaded: false,

  session: void 0,
  bpmn: {
    processId: '',
    taskId: '',
    ServerTaskKey: ServerTaskKey.starting,
    variables: [{}],
  },

  applicationForm: {
    initialized: false,
    productCategory: void 0,
    applicationType: void 0,
  },

  selectedProcessData: {
    data: void 0,
    scene: SceneType.default,
    loading: false,
    loanStage: LoanStage.Application,
  },

  pipelineTask: {
    pipelineInitialized: false,
  },

  userProfile: void 0,
  userSetting: {
    loading: false,
    pipelineStatus: void 0,
    pipelineStatusInitialized: false,
  },
  userType: void 0,
  loginType: void 0,

  detectUserActiveService: {
    instance: void 0,
  },
  notificationStation: {
    notifications: [],
  },
};

export const rootStore = RootStore.create(initialState);

export type IRoot = Instance<typeof RootStore>;
const RootStoreContext = createContext<null | IRoot>(null);

export const Provider = RootStoreContext.Provider;

export const useMst = () => {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
