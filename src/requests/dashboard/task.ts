import { LoanTask, TaskFiles } from '@/types';
import { del, get, post, put } from '../axios';

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

export const _uploadTaskFile = (params: FormData, taskId: string) => {
  return put<TaskFiles[]>(`/dashboard/loan/task/${taskId}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const _deleteTaskFile = (
  taskId: string,
  params: { fieldName: string; fileUrl: string },
) => {
  return del(`/dashboard/loan/task/${taskId}`, {
    data: params,
  });
};

export const _restartPaymentPipeline = (taskId: string) => {
  return post(`/dashboard/loan/task/payment/${taskId}`);
};

export const _fetchAttachmentFile = () => {
  return get('/dashboard/loan/task/attachment');
};
