import { get, post } from './axios';
import { User } from '@/types/user';

export const _fetchUserSetting = () => {
  return get<User.UserSetting>('/dashboard/user/settings/info');
};

export const _updateUserSetting = (setting: Partial<User.UserSetting>) => {
  return post<User.UserSetting>('/dashboard/user/settings/info', setting);
};

export const _userSingUp = (params: User.UserSignUp) => {
  return post<User.UserSignUp>('/usercenter/api/user/sign_up', params);
};

export const _userSingIn = (params: User.UserSignIn) => {
  return post<User.UserSignInRequest>('/usercenter/api/user/sign_in', params);
};

export const _userRefreshToken = (params: User.UserRefreshTokenParams) => {
  return get<User.UserRefreshTokenRequest>('/usercenter/api/token/refresh', {
    params,
  });
};

export const _userVerifyCode = (params: User.UserVerifyCodeParams) => {
  return post<any>('/usercenter/api/user/verifyCode', params);
};

export const _userSendCode = (params: User.UserSendCodeParams) => {
  return post<any>('/usercenter/api/user/sendCode', params);
};

export const _userChangeEmail = (params: User.UserChangeEmailParams) => {
  return post<any>('/usercenter/api/user/changeEmail', params);
};

export const _userChangePassword = (params: User.UserChangePasswordParams) => {
  return post<any>('/usercenter/api/user/changePass', params);
};

export const _userResetPassword = (params: User.UserResetPassParams) => {
  return post<any>('/usercenter/api/user/resetPass', params);
};

export const _userUpload = (params) => {
  return post<User.UserUploadRequest[]>('/dashboard/user/upload ', params);
};
