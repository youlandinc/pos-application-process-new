import { del, get, post, put } from './axios';
import { User } from '@/types/user';
import { DashboardDocumentStatus, TaskFiles } from '@/types';

// common

export const _fetchSaasConfig = () => {
  return get<User.TenantConfigRequest>(
    '/usercenter/api/tenant/query/configSaas',
  );
};

// payment
export interface ICreateSpecifyPaymentParams {
  id: number | undefined;
  receiptEmail: string | undefined;
  orderNo: string | undefined;
}

export interface IGetPaymentSignatureParams {
  bizOrderNo: string;
  billTo: {
    firstName: string;
    lastName: string;
    address1: string;
    locality: string;
    administrativeArea: string;
    postalCode: string;
    county: string;
    country: string;
    district: string;
    email: string;
    phoneNumber: string;
  };
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
  paymentName: string | null;
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

// payment
export const _creatSpecifyPayment = (orderNo: string, source: string) => {
  return get(
    `/pos/appraisal/payment/link/info?orderNo=${orderNo}&&source=${source}`,
  );
};

export const _getPaymentSignature = (params: IGetPaymentSignatureParams) => {
  return post('/pos/appraisal/payment/fetchSignature', params);
};

export const _updateSpecifyContactInfo = (params: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  instructions: string;
}) => {
  return put('/pos/appraisal/payment/contact/info', params);
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

//export interface ResponsePortalFetchData {
//  finishNum: number;
//  totalNum: number;
//  loanNumber: string | null;
//  propertyAddress: string | null;
//  docs: {
//    categoryKey: string;
//    categoryName: string;
//    collapse: boolean;
//    categoryDocs: {
//      fileKey: string;
//      fileName: string;
//      files: TaskFiles[];
//      id: number;
//      templateName: string;
//      templateUrl: string;
//      status: DashboardDocumentStatus;
//    }[];
//  }[];
//}
//
//export const _portalFetchData = (loanId: string) => {
//  return get<ResponsePortalFetchData>(
//    `/los/anon/document/portal/form/${loanId}`,
//  );
//};

export const _portalFetchData = (loanId: string) => {
  return get(`/los/anon/document/portal/form/${loanId}`);
};

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
