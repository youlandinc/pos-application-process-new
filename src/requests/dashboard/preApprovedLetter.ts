import { post, get } from '../axios';
import {
  PreApprovalLetterMPData,
  PreApprovalLetterBPData,
  PreApprovalLetterBRData,
} from '@/types/dashboardData';

export const _fetchPreApprovedLetterCheck = <
  T extends
    | PreApprovalLetterMPData
    | PreApprovalLetterBPData
    | PreApprovalLetterBRData,
>(
  processId = '',
  checkData: T,
) => {
  return post(`/dashboard/letter/${processId}/check`, checkData);
};

export const _sendPreapprovalLetter = (processId: string, email: string) => {
  return post(`/dashboard/letter/${processId}/send/${email}`);
};

export const _fetchPDFFile = (processId) => {
  return get(`/dashboard/letter/${processId}/pdf`, { responseType: 'blob' });
};

export const _fetchPreApprovedLetterInfo = <
  T extends
    | PreApprovalLetterMPData
    | PreApprovalLetterBPData
    | PreApprovalLetterBRData,
>(
  processId: string,
) => {
  return get<T>(`/dashboard/letter/${processId}`);
};
