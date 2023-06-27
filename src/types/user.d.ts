import { AddressData } from '@/types/application';
import { TaskFiles } from '@/types/pipeline';
import { BizType, LoginType, UserType } from './enum';

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
  }

  interface UserRefreshTokenParams {
    refreshToken: string;
    appkey: string;
  }

  interface UserRefreshTokenRequest {
    accessToken: string;
    expiredIn?: number;
    refreshToken: string;
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
    logoUrl: string;
    organizationName: string;
    organizationInfo: OrganizationInfo;
    phone: string;
    signOffEmail: string;
    replyEmail: string;
    saasUrl: string;
    extInfo: ExtInfo$3Type;
  }

  type UserUploadRequest = TaskFiles;
}
