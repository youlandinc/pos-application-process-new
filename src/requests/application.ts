import { get, post, put } from '@/requests/axios';
import {
  EstimateRateFormData,
  LoanProductCategoryEnum,
  LoanSnapshotEnum,
  LoanTypeEnum,
} from '@/types';

export const _startNewLoan = (params: {
  loanType: LoanTypeEnum;
  productCategory: LoanProductCategoryEnum;
}) => {
  return post('/pos/loan/process', params);
};

export const _updateLoan = (params: {
  snapshot: LoanSnapshotEnum;
  nextSnapshot: LoanSnapshotEnum;
  loanId: string;
  data: any;
}) => {
  return put('/pos/loan/process', params);
};

export const _redirectLoan = (params: {
  loanId: string;
  nextSnapshot: LoanSnapshotEnum;
}) => {
  return put('/pos/loan/process/redirect', params);
};

export const _bindLoan = (params: {
  loanId: string;
  nextSnapshot: LoanSnapshotEnum;
}) => {
  return put('/pos/loan/process/bind', params);
};

export const _fetchLoanDetailTest = (loanId: string) => {
  return get(`/pos/loan/process/data/${loanId}`);
};

export const _fetchProductList = (
  params: Partial<
    {
      tenantId: string;
      loanId: string;
      state: string;
      ficoScore: string | null;
      liquidity: number;
      propertyValue: number;
      loanAmount: number;
    } & EstimateRateFormData
  >,
) => {
  return post('/pos/loan/process/rates', params);
};

export const _fetchFile = (loanId: string, fileType: 'summary' | 'letter') => {
  return get(`/pos/loan/process/${loanId}/${fileType}`);
};

export const _downloadFile = (loanId: string) => {
  return get(`/pos/loan/process/${loanId}/letter/download`, {
    responseType: 'blob',
  });
};

export const _fetchExecutiveList = (keyword?: string | null, size = 10) => {
  return post('/usercenter/api/user/fetchList', {
    size,
    keyword,
    role: 'EXECUTIVE',
    page: 0,
  });
};
