import { get, post } from './axios';
import { User } from '@/types/user';

//export const _fetchUserSetting = () => {
//  return get<User.UserSetting>('/dashboard/user/settings/info');
//};
//
//export const _updateUserSetting = (setting: Partial<User.UserSetting>) => {
//  return post<User.UserSetting>('/dashboard/user/settings/info', setting);
//};

export const _userSingUp = (params: User.UserSignUp) => {
  return post<User.UserSignUp>('/usercenter/api/consumer/signUp/user/sendCode', params);
};

export const _userSingIn = (params: User.UserSignIn) => {
  return post<User.UserSignInRequest>('/usercenter/api/consumer/user/sign_in', params);
};

export const _userRefreshToken = (params: User.UserRefreshTokenParams) => {
  return get<User.UserRefreshTokenRequest>('/usercenter/api/token/refresh', {
    params,
  });
};

export const _userVerifyCode = (params: User.UserVerifyCodeParams) => {
  return post<any>('/usercenter/api/consumer/signUp/user/verifyCode', params);
};

export const _userSendCode = (params: User.UserSendCodeParams) => {
  return post<any>('/usercenter/api/consumer/signUp/user/resendCode', params);
};

export const _userChangeEmail = (params: User.UserChangeEmailParams) => {
  return post<any>('/usercenter/api/consumer/changeEmail/user/sendCode', params);
};

export const _userCompletedChangeEmail = (params: User.UserVerifyCodeParams) => {
  return post<any>('/usercenter/api/consumer/changeEmail/user/complete', params);
};

export const _userChangePassword = (params: User.UserChangePasswordParams) => {
  return post<any>('/usercenter/api/consumer/changePassword/user/complete', params);
};

export const _userSendCodeForResetPassword = (params: User.UserSendCodeParams) => {
  return post<any>('/usercenter/api/consumer/resetPassword/user/sendCode', params);
};

export const _userResetPassword = (params: User.UserResetPassParams) => {
  return post<any>('/usercenter/api/consumer/resetPassword/user/complete', params);
};

// export const _userUpload = (params) => {
//   return post<User.UserUploadRequest[]>('/dashboard/user/upload ', params);
// };

export const _fetchUserInfoByToken = (params: { token: string }) => {
  return get('/usercenter/api/user/fetchUserInfo', {
    headers: { Authorization: `Bearer ${params.token}` },
  });
};
