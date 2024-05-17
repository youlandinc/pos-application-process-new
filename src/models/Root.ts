import { createContext, useContext } from 'react';
import Router from 'next/router';

import { Instance, types } from 'mobx-state-tree';

import {
  ApplicationForm,
  DetectUserActiveService,
  NotificationStation,
  // PTaskForm,
  // UserSetting,
  //UserConfig,
  //UserProfile
} from './base';

import { LoginType, UserType } from '@/types/enum';
import { User } from '@/types/user';

import { FormData, userpool } from '@/constants';
import {
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanSnapshotEnum,
} from '@/types';
import { DashboardInfo } from '@/models/base/DashboardInfo';

export const RootModel = {
  persistDataLoaded: types.boolean,
  loadedGoogle: types.boolean,

  applicationForm: ApplicationForm,
  dashboardInfo: DashboardInfo,

  // pipelineTask: PTaskForm,

  session: types.maybe(types.frozen<UserSession>()),
  // userSetting: UserSetting,
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

  isLogout: types.boolean,
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
    resetApplicationForm() {
      self.applicationForm.resetForm();
    },
    logout() {
      if (Router.pathname === '/auth/sign_in') {
        return;
      }
      this.updateSession();
      this.updateProfile();
      self.isLogout = true;
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

  applicationForm: {
    loading: true,
    isBind: false,
    initialized: false,
    loanId: '',
    snapshot: LoanSnapshotEnum.starting_question,
    startingQuestion: FormData[LoanSnapshotEnum.starting_question],
    estimateRate: FormData[LoanSnapshotEnum.estimate_rate],
    loanAddress: FormData[LoanSnapshotEnum.loan_address],
    backgroundInformation: FormData[LoanSnapshotEnum.background_information],
    compensationInformation: FormData[LoanSnapshotEnum.compensation_page],
  },
  dashboardInfo: {
    propertyAddress: FormData[LoanSnapshotEnum.loan_address],
    propertyType: LoanPropertyTypeEnum.default,
    propertyUnit: LoanPropertyUnitEnum.default,
    loanType: '',
    loading: false,
    loanId: '',
  },

  // pipelineTask: {
  //   pipelineInitialized: false,
  //   allowSubmit: false,
  // },

  userProfile: void 0,
  // userSetting: {
  //   loading: false,
  //   pipelineStatus: void 0,
  //   pipelineStatusInitialized: false,
  //   applicable: false,
  // },
  userType: void 0,
  loginType: void 0,

  detectUserActiveService: {
    instance: void 0,
  },
  notificationStation: {
    notifications: [],
  },
  isLogout: false,
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
