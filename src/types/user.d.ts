import { AddressData } from '@/types/application';
import { TaskFiles } from '@/types/pipeline';
import {
  BizType,
  DomainSource,
  DomainState,
  FeeUnitEnum,
  FreeTrialState,
  LoginType,
  ServiceTypeEnum,
  UserType,
} from './enum';

declare namespace User {
  interface BaseUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }

  interface BorrowerInfo extends BaseUserInfo {
    address: AddressData;
  }

  interface TeamMemberInfo extends BaseUserInfo {
    title?: string;
    profile: string;
    NMSLNumber?: string;
  }

  interface BaseParam {
    appkey: string;
  }

  interface UserSignIn extends BaseParam {
    loginType: LoginType;
    emailParam?: {
      account: string;
      password: string;
    };
    googleParam?: {
      idToken: string;
    };
  }

  interface UserSignUp extends BaseParam {
    emailParam: {
      email: string;
      password: string;
      userType: UserType;
      phone: string;
    };
  }

  interface UserSignInRequest extends UserRefreshTokenRequest {
    userProfile: Partial<UserProfile>;
  }

  interface UserProfile {
    account: string;
    avatar: string | null;
    email: string | undefined;
    loginType: LoginType;
    name: string;
    tenantId: string;
    userId: string | undefined;
    userType: UserType;
    firstName: string;
    lastName: string;
    backgroundColor: string;
  }

  interface UserRefreshTokenParams {
    refreshToken: string;
    appkey: string;
  }

  interface UserRefreshTokenRequest {
    accessToken: string;
    expiredIn?: number;
    refreshToken: string;
    forceChangePassword?: boolean;
  }

  interface UserResetPasswordParams {
    newPass: string;
    appkey: string;
    verifyCode: string;
    email: string;
  }

  interface UserChangePasswordParams {
    newPass: string;
    oldPass: string;
  }

  interface UserChangeEmailParams {
    oldEmail: string;
    newEmail: string;
  }

  interface UserSendCodeParams {
    email: string;
    appkey: string;
    bizType: BizType;
  }

  interface UserVerifyCodeParams {
    code: string;
    appkey: string;
    email: string;
    bizType: string;
  }

  interface UserResetPassParams {
    newPass: string;
    appkey: string;
    verifyCode: string;
    email: string;
  }

  interface TenantConfigRequest {
    id: number;
    tenantId: string;
    logoUrl?: string;
    faviconUrl?: string;
    organizationInfo?: {
      name: string;
    };
    organizationName: string;
    email: string;
    phone: string;
    signOffEmail?: string;
    replyEmail?: string;
    saasUrl?: string;
    extInfo?: {
      posSettings?: TenantConfigPOSSettings;
    };
    posSettings?: TenantConfigPOSSettings;
    address: AddressData;
    whiteLabelUrl: string;
    losSettings: {
      customFee: FeeSettings | null;
    };
    useTimes: number;
    freeTrialState: FreeTrialState;

    serviceTypeEnum: ServiceTypeEnum;
    serviceSelected: boolean;
    website: null | string;

    legalAgreements?: {
      privacyPolicyUrl: string;
      signaturesUrl: string;
      termsUrl: string;
    };
  }

  interface POSBorrowerTypes {
    key: UserType;
    value: string;
    allowed: boolean;
  }

  interface TenantConfigPOSSettings {
    phone: string;
    email: string;
    members: Partial<TenantConfigUserInfo>[];
    workingDays: string;
    workingHours: string;
    h?: number;
    l?: number;
    s?: number;
    domains?: DomainDetails[];
    customFee?: POSCustomFee;
    isWarning?: boolean;
    borrowerTypes?: POSBorrowerTypes[];
    softCreditRequirement?: POSSoftCreditRequirement;
    customLoanTerms?: POSBorrowerTypes[];
  }

  interface TenantConfigUserInfo {
    isFinished: boolean;
    firstName: string;
    lastName: string;
    name: string;
    birthDay: string;
    gender: string;
    maritalStatus: string;
    age: number;
    email: string;
    phone: string;
    ssn: string;
    companyName: string;
    title: string;
    avatar: string;
    addressInfo: AddressData & {
      isFinished?: boolean;
      statename?: string;
      countyFIPS?: string;
    };
    residencyStatus: string;
  }

  type FeeSettings = {
    lenderOriginationFee: number;
    floodCertification: number;
    underwritingFee: number;
    documentPreparationFee: number;
    creditReport: number;
    projectOversightFee: number;
    backgroundCheck: number;
    miscFee: number;
  };

  type UserUploadRequest = TaskFiles;

  type POSCustomFee = {
    brokerAdditionalFee: IEditFeeItem[];
    brokerOriginationPoints: number | undefined;
  };

  type IEditFeeItem = {
    fieldName: string;
    unit: FeeUnitEnum;
    value: number | string | undefined | null;
    isFixed?: boolean;
  };

  interface DomainDetails {
    id: number;
    domainName: string;
    state: DomainState;
    source: DomainSource;
  }
}
