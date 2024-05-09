import { get, post } from '@/requests/axios';
import { DashboardDocumentsResponse, DashboardTaskKey } from '@/types';

// right box info
export const _fetchDashboardInfo = (loanId: string) => {
  return get(`/pos/loan/process/property/${loanId}`);
};

// overview
export const _fetchLoanDetail = (loanId: string) => {
  return get(`/pos/loan/process/data/${loanId}`);
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
