import { get, post, put } from './axios';
import { User } from '@/types/user';
import {
  ForgotPasswordFetchCodeRequestParams,
  ForgotPasswordSubmitRequestParams,
  ForgotPasswordVerifyCodeRequestParams,
} from '@/types';

export const _userSingUp = (params: User.UserSignUp) => {
  return post<User.UserSignUp>(
    '/usercenter/api/consumer/signUp/user/sendCode',
    params,
  );
};

export const _userSingIn = (params: User.UserSignIn) => {
  return post<User.UserSignInRequest>(
    '/usercenter/api/consumer/user/sign_in',
    params,
  );
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

// forget password
export const _fetchUserResetPasswordSendCode = (
  params: ForgotPasswordFetchCodeRequestParams,
) => {
  return post('/usercenter/api/consumer/resetPassword/user/sendCode', params);
};

export const _fetchUserResetPasswordVerifyCode = (
  params: ForgotPasswordVerifyCodeRequestParams,
) => {
  return post('/usercenter/api/consumer/resetPassword/user/verifyCode', params);
};

export const _fetchUserResetPasswordSubmit = (
  params: ForgotPasswordSubmitRequestParams,
) => {
  return post('/usercenter/api/consumer/resetPassword/user/complete', params);
};

// force a password change
export const _forceUpdatePassword = (params: { newPass: string }) => {
  return post('usercenter/api/consumer/user/firstLogin/resetPassword', params);
};

// sse notification
export const _fetchMessage = (params: {
  status: string;
  page: number;
  size: number;
}) => {
  return post('/pos/notification/page', params);
};

export const _readMessage = (params: { messageId: string }) => {
  return put('/pos/notification/read', params);
};

export const _readAllMessage = (params: { fileId: number | string }) => {
  return put('/pos/notification/batchRead', params);
};

export const _signInByToken = (token: string) => {
  return get('/usercenter/api/user/fetchUserInfo', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
