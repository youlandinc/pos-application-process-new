import { del, get, post, put } from './axios';
import { PipelineTaskItem, TaskFiles } from '@/types/pipeline';

export const _fetchPipelineTask = () => {
  return get('/dashboard/broker/application/task');
};

export const _completePipelineTask = (params: PipelineTaskItem<any>) => {
  return post('/dashboard/broker/application/task', params);
};

export const _deleteUpload = (taskId: string, params: { url: string }) => {
  return del(`/dashboard/broker/application/task/${taskId}`, {
    data: params.url,
  });
};

export const _addTaskFile = (params: FormData, taskId: string) => {
  return put<TaskFiles[]>(
    `/dashboard/broker/application/task/${taskId}`,
    params,
  );
};

export const _downloadBrokerFile = (params: { url: string }) => {
  return get('/usercenter/api/common/file/download', {
    params,
    responseType: 'blob',
  });
};

export const _previewDocument = (params: { type: string; taskId: string }) => {
  return post('/dashboard/broker/application/preview', params);
};

export const _fetchLegalFile = (taskId: string) => {
  return get(`/dashboard/broker/application/legalPdf/${taskId}`);
};

export const _fetchBrokerIsApproval = () => {
  return get('/dashboard/broker/application/tips');
};

// delete
export const _fetchBrokerStatus = () => {
  return get('/dashboard/broker/approve/status');
};
