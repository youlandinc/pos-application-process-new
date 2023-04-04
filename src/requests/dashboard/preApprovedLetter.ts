import { get, post } from '../axios';
import {
  BPPreApprovalLetterData,
  BRPreApprovalLetterData,
  MPPreApprovalLetterData,
} from '@/types/dashboard';

export const _fetchPreApprovedLetterCheck = <
  T extends
    | BRPreApprovalLetterData
    | BPPreApprovalLetterData
    | MPPreApprovalLetterData,
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
    | BRPreApprovalLetterData
    | BPPreApprovalLetterData
    | MPPreApprovalLetterData,
>(
  processId: string,
) => {
  return get<T>(`/dashboard/letter/${processId}`);
};
