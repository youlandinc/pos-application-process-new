import { get, post, put } from '@/requests/axios';
import {
  DashboardDocumentsResponse,
  DashboardTaskKey,
  DashboardTeamResponse,
  LoanSnapshotEnum,
} from '@/types';

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

// documents
export const _fetchLoanDocumentData = (loanId: string) => {
  return get<DashboardDocumentsResponse>(`/pos/task/docs/${loanId}`);
};

// team
export const _fetchTeamMembers = (loanId: string) => {
  return get<DashboardTeamResponse>(`/pos/loan/officer/${loanId}`);
};
