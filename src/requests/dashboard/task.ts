import { get, post } from '../axios';

export type STaskItemStatus = 'undone' | 'processing' | 'complete';
interface STaskItemsStatusResponse {
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
