import { del, get, post, put } from './axios';
import { PipelineTaskItem, TaskFiles } from '@/types/pipeline';

export const _fetchPipelineTask = () => {
  return get('/dashboard/pipeline/application/task');
};

export const _completePipelineTask = (params: PipelineTaskItem<any>) => {
  return post('/dashboard/pipeline/application/task', params);
};

export const _deleteUpload = (taskId: string, params: { url: string }) => {
  return del(`/dashboard/pipeline/application/task/${taskId}`, {
    data: params.url,
  });
};

export const _addTaskFile = (params: FormData, taskId: string) => {
  return put<TaskFiles[]>(
    `/dashboard/pipeline/application/task/${taskId}`,
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
  return post('/dashboard/pipeline/application/preview', params);
};

export const _fetchLegalFile = (taskId: string) => {
  return get(`/dashboard/pipeline/application/legalPdf/${taskId}`);
};

export const _fetchBrokerIsApproval = () => {
  return get('/dashboard/pipeline/application/tips');
};

// delete
export const _fetchPipelineStatus = () => {
  return get('/dashboard/pipeline/approve/status');
};

export const _deleteProcess = (processInsId: string) => {
  return del(`/processes/${processInsId}`);
};
