import { get } from '@/requests/axios';
import { DashboardDocumentsResponse } from '@/types';

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
  taskKey: string;
}) => {
  return get(`/pos/task/${params.loanId}/${params.taskKey}`);
};

// documents
export const _fetchLoanDocumentData = (loanId: string) => {
  return get<DashboardDocumentsResponse[]>(`/pos/task/docs/${loanId}`);
};
