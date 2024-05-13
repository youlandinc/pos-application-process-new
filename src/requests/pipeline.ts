import { del, get, post } from './axios';
import { PipelineRequestParams } from '@/types/process';

// export const _fetchPipelineTask = () => {
//   return get('/usercenter/pipeline/application/task');
// };
//
// export const _completePipelineTask = (params: PipelineTaskItem<any>) => {
//   return post('/usercenter/pipeline/application/task', params);
// };
//
// export const _deleteUpload = (taskId: string, params: { url: string }) => {
//   return del(`/usercenter/pipeline/application/task/${taskId}`, {
//     data: params.url,
//   });
// };
//
// export const _addTaskFile = (params: FormData, taskId: string) => {
//   return put<TaskFiles[]>(
//     `/usercenter/pipeline/application/task/${taskId}`,
//     params,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     },
//   );
// };
//
export const _downloadBrokerFile = (params: { url: string }) => {
  return get('/usercenter/api/common/file/download', {
    params,
    responseType: 'blob',
  });
};
//
// export const _previewDocument = (params: { type: string; taskId: string }) => {
//   return post('/usercenter/pipeline/application/preview', params);
// };
//
// export const _fetchLegalFile = (taskId: string) => {
//   return get(`/usercenter/pipeline/application/legalPdf/${taskId}`);
// };
//
// // delete
// export const _fetchPipelineStatus = () => {
//   return get('/usercenter/pipeline/approve/status');
// };
//
// export const _submitPipelineTask = () => {
//   return post('/usercenter/pipeline/application/submit');
// };

// new
export const _fetchPipelineLoanList = (params: PipelineRequestParams) => {
  return post('/pos/loan/user/process', params);
};

export const _deletePipelineLoan = (loanId: string) => {
  return del(`/pos/loan/process/${loanId}`);
};
