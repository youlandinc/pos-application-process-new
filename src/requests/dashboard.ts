import { get, post, put } from '@/requests/axios';
import {
  DashboardDocumentsResponse,
  DashboardPaymentDetailsResponse,
  DashboardTaskKey,
  DashboardTeamResponse,
  LoanSnapshotEnum,
} from '@/types';
import { AppraisalProfileData } from '@/components/molecules';

// right box info
export const _fetchDashboardInfo = (loanId: string) => {
  return get(`/pos/loan/process/property/${loanId}`);
};

// overview
export const _fetchLoanDetail = (loanId: string) => {
  return get(`/pos/loan/process/data/${loanId}`);
};

export const _resubmitLoan = (params: {
  loanId: string;
  nextSnapshot: LoanSnapshotEnum;
}) => {
  return put('/pos/loan/process/resubmit', params);
};

// tasks
export const _fetchLoanTaskList = (loanId: string) => {
  return get(`/pos/task/${loanId}`);
};

export const _fetchLoanTaskDetail = (params: {
  loanId: string;
  taskKey: DashboardTaskKey;
}) => {
  return get(`/pos/task/${params.loanId}/${params.taskKey}`);
};

export const _updateLoanTaskDetail = (params: {
  loanId: string;
  taskKey: DashboardTaskKey;
  data: any;
}) => {
  return post('/pos/task', params);
};

// appraisal
export const _fetchAppraisalData = (loanId: string) => {
  return get(`/pos/appraisal/info/${loanId}`);
};

export const _updateAppraisalData = (params: AppraisalProfileData) => {
  return put('/pos/appraisal/info', {
    ...params,
    source: 'POS',
  });
};

export const _fetchAppraisalPaymentLinkInfo = (loanId: string) => {
  return get(`/pos/appraisal/payment/info/${loanId}`);
};

export const _sendAppraisalPaymentLink = (params: {
  loanId: string;
  email: string;
}) => {
  return post('/pos/appraisal/payment/link', params);
};

export const _fetchAppraisalPaymentData = (params: {
  loanId: string;
  receiptEmail?: string;
  description?: string;
}) => {
  return post<DashboardPaymentDetailsResponse>(
    '/pos/appraisal/payment',
    params,
  );
};

export const _restartAppraisalPaymentProcess = (loanId: string) => {
  return post(`/pos/appraisal/payment/${loanId}`);
};

// documents
export const _fetchLoanDocumentData = (loanId: string) => {
  return get<DashboardDocumentsResponse>(`/pos/task/docs/${loanId}`);
};

// team
export const _fetchTeamMembers = (loanId: string) => {
  return get<DashboardTeamResponse>(`/pos/loan/officer/${loanId}`);
};
