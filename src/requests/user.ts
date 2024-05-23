import { get, post } from './axios';
import { User } from '@/types/user';

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

export const _userChangePassword = (params: User.UserChangePasswordParams) => {
  return post<any>(
    '/usercenter/api/consumer/changePassword/user/complete',
    params,
  );
};

export const _userSendCodeForResetPassword = (
  params: User.UserSendCodeParams,
) => {
  return post<any>(
    '/usercenter/api/consumer/resetPassword/user/sendCode',
    params,
  );
};

export const _userResetPassword = (params: User.UserResetPassParams) => {
  return post<any>(
    '/usercenter/api/consumer/resetPassword/user/complete',
    params,
  );
};

export const _fetchUserInfoByToken = (params: { token: string }) => {
  return get('/usercenter/api/user/fetchUserInfo', {
    headers: { Authorization: `Bearer ${params.token}` },
  });
};

interface ForgotPasswordFetchCodeRequestParams {
  appkey: string;
  email: string;
  bizType: string;
}

interface ForgotPasswordVerifyCodeRequestParams {
  appkey: string;
  email: string;
  code: string;
  bizType: string;
}

interface ForgotPasswordSubmitRequestParams {
  accessToken: string;
  newPass: string;
  appkey: string;
}

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
