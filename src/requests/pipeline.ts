import { del, get, post } from './axios';
import { PipelineRequestParams } from '@/types/process';

export const _downloadBrokerFile = (params: { url: string }) => {
  return get('/usercenter/api/common/file/download', {
    params,
    responseType: 'blob',
  });
};

// new
export const _fetchPipelineLoanList = (params: PipelineRequestParams) => {
  return post('/pos/loan/user/process', params);
};

export const _deletePipelineLoan = (loanId: string) => {
  return del(`/pos/loan/process/${loanId}`);
};
