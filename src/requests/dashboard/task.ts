import { LoanTask } from '@/types';
import { get, post } from '../axios';

export enum STaskItemStatus {
  UNDONE = 'undone',
  PROCESSING = 'processing',
  COMPLETE = 'complete',
  FAIL = 'fail',
}

export interface STaskItemsStatusResponse {
  [key: string]: STaskItemStatus;
}

export const _fetchTaskItemStatus = (processId = '') => {
  return get<STaskItemsStatusResponse>(
    `/dashboard/user/tasks/status/${processId}`,
  );
};

// payment
type PostPayment = {
  procInstId: string;
  receiptEmail?: string;
  description?: string;
};

export interface SPaymentDetails {
  clientSecret: string;
  amount: number;
}

export const _fetchPaymentDetails = (paymentData: PostPayment) => {
  return post<SPaymentDetails>('/dashboard/pay/appraisal', paymentData);
};

export const _fetchLoanTask = (processId = '') => {
  return get<LoanTask>(`/dashboard/loan/task/${processId}`);
};

export const _fetchTaskFormInfo = (taskId: string) => {
  return get(`/dashboard/loan/task/detail/${taskId}`);
};

export const _updateTaskFormInfo = (data: {
  taskId: string;
  taskForm: any;
}) => {
  return post('/dashboard/loan/task/', data);
};

export const _notifyTaskUpdate = (processId: string) => {
  return post(`/dashboard/loan/task/notify/${processId}`);
};
