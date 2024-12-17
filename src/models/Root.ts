import { createContext, useContext } from 'react';
import Router from 'next/router';

import { Instance, types, unprotect } from 'mobx-state-tree';

import {
  ApplicationForm,
  DetectUserActiveService,
  NotificationStation,
  //UserSetting,
  //UserConfig,
  //UserProfile
} from './base';

import { LoginType, UserType } from '@/types/enum';
import { User } from '@/types/user';

import { FormData, userpool } from '@/constants';
import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanSnapshotEnum,
} from '@/types';
import { DashboardInfo } from '@/models/base/DashboardInfo';
import { Questionnaire } from './account/Questionnaire';

export const RootModel = {
  persistDataLoaded: types.boolean,
  loadedGoogle: types.boolean,
  totalNotification: types.number,
  notificationDocuments: types.model({
    categoryKey: types.maybe(types.string),
    fileId: types.maybe(types.number),
    fileName: types.maybe(types.string),
  }),

  applicationForm: ApplicationForm,
  dashboardInfo: DashboardInfo,

  questionnaire: Questionnaire,

  session: types.maybe(types.frozen<UserSession>()),
  // userSetting: UserSetting,
  userProfile: types.maybe(types.frozen<ClientUserProfile>()),

  // todo: need extract to user model
  // useConfig:UserConfig,
  // UserProfile: UserProfile,
  userType: types.maybe(types.enumeration(Object.values(UserType))),
  loginType: types.maybe(types.enumeration(Object.values(LoginType))),

  detectUserActiveService: DetectUserActiveService,
  notificationStation: NotificationStation,

  logoutNotification: types.boolean,
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
    setLogoutNotification(val: boolean) {
      self.logoutNotification = val;
    },
    setTotalNotification(val: number) {
      self.totalNotification = val;
    },
    setNotificationDocument(val: {
      categoryKey: string;
      fileId: number;
      fileName: string;
    }) {
      self.notificationDocuments.categoryKey = val.categoryKey;
      self.notificationDocuments.fileId = val.fileId;
      self.notificationDocuments.fileName = val.fileName;
    },
    logout() {
      if (Router.pathname === '/auth/login') {
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
      Router.push('/auth/login');
    },
  };
});

const initialState = {
  totalNotification: 0,
  notificationDocuments: {
    categoryKey: '',
    fileId: 0,
    fileName: '',
  },

  loadedGoogle: false,
  persistDataLoaded: false,

  session: void 0,

  applicationForm: {
    loading: true,
    isBind: false,
    initialized: false,
    productCategory: LoanProductCategoryEnum.stabilized_bridge,
    propertyType: LoanPropertyTypeEnum.single_family,
    loanId: '',
    snapshot: LoanSnapshotEnum.starting_question,
    startingQuestion: FormData[LoanSnapshotEnum.starting_question],
    estimateRate: FormData[LoanSnapshotEnum.estimate_rate],
    loanInformation: FormData[LoanSnapshotEnum.estimate_rate],
    loanAddress: FormData[LoanSnapshotEnum.loan_address],
    backgroundInformation: FormData[LoanSnapshotEnum.background_information],
    compensationInformation: FormData[LoanSnapshotEnum.compensation_page],
    submitLead: {
      addressInfo: { ...FormData[LoanSnapshotEnum.loan_address] },
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      additionalInfo: '',
    },
  },
  dashboardInfo: {
    propertyAddress: FormData[LoanSnapshotEnum.loan_address],
    propertyType: LoanPropertyTypeEnum.default,
    propertyUnit: LoanPropertyUnitEnum.default,
    loanType: '',
    loading: false,
    loanId: '',
    loanNumber: '',
  },

  questionnaire: {
    licenses: [],
  },

  userProfile: void 0,

  userType: void 0,
  loginType: void 0,

  detectUserActiveService: {
    instance: void 0,
  },
  notificationStation: {
    notifications: [],
  },
  logoutNotification: false,
};

export const rootStore = RootStore.create(initialState);

unprotect(rootStore);

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
