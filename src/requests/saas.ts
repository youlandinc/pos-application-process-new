import { del, get, post, put } from './axios';
import { User } from '@/types/user';

// common
export const _fetchMyTeamData = () => {
  return get('/usercenter/api/tenant/query/fulfillConfig');
};

export const _fetchSaasConfig = () => {
  return get<User.TenantConfigRequest>(
    '/usercenter/api/tenant/query/configSaas',
  );
};

// payment
export interface ICreateSpecifyPaymentParams {
  id: number | undefined;
  receiptEmail: string | undefined;
}

export interface ICreatePaymentRes {
  loanApprovalId: number;
  clientSecret: string;
  paymentAmount: number;
  loanRate: ILoanRate;
  created: number;
  borrowerName: string;
  propertyAddress: string;
  productName: string;
  appraisalFees: number;
  expeditedFees: number;
  isExpedited: boolean;
}

export interface ILoanRate {
  isFinished: boolean;
  loanPurpose: string;
  arv: number;
  cashOutAmount: number;
  estimatedPropertyValue: number;
  interestRate: number;
  purchaseLoanAmount: number;
  loanTerm: number;
  loanValue: number;
  loanCost: number;
  purchasePrice: number;
  rehabAmount: number;
  remainingLoanBalance: number;
  totalLoanAmount: number;
  interestReserveAmount: number;
}

export const _creatSpecifyPayment = (param: ICreateSpecifyPaymentParams) => {
  return post<ICreatePaymentRes>('/los/loan/approval/createPayment', param);
};

// document_portal
export const _portalUploadFile = (params: {
  loanId: string;
  files: FormData;
}) => {
  return put(`/los/anon/document/portal/form/${params.loanId}`, params.files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const _portalDeleteFile = (params: {
  loanId: string;
  formId: string;
  url: string;
}) => {
  return del('/los/anon/document/portal/form', { data: params });
};

export const _portalFetchData = (loanId: string) => {
  return get(`/los/anon/document/portal/form/${loanId}`);
};

// ?
export const _portalRating = (params: {
  loanId: string;
  score: string | number | null;
}) => {
  return post(`/los/anon/document/portal/evaluate/${params.loanId}`, {
    score: params.score,
  });
};

export const _portalClickTimes = (loanId: string) => {
  return post(`/los/anon/document/portal/access/${loanId}`);
};

export const _createProcessIdByClickApply = (params: any) => {
  return post('/processes/from/home', params);
};
