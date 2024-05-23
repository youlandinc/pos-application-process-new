export interface ForgotPasswordFetchCodeRequestParams {
  appkey: string;
  email: string;
  bizType: string;
}

export interface ForgotPasswordVerifyCodeRequestParams {
  appkey: string;
  email: string;
  code: string;
  bizType: string;
}

export interface ForgotPasswordSubmitRequestParams {
  accessToken: string;
  newPass: string;
  appkey: string;
}
