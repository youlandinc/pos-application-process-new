import { del, get, post, put } from './axios';
import { PipelineTaskItem, TaskFiles } from '@/types/pipeline';

export const _fetchPipelineTask = () => {
  return get('/usercenter/pipeline/application/task');
};

export const _completePipelineTask = (params: PipelineTaskItem<any>) => {
  return post('/usercenter/pipeline/application/task', params);
};

export const _deleteUpload = (taskId: string, params: { url: string }) => {
  return del(`/usercenter/pipeline/application/task/${taskId}`, {
    data: params.url,
  });
};

export const _addTaskFile = (params: FormData, taskId: string) => {
  return put<TaskFiles[]>(
    `/usercenter/pipeline/application/task/${taskId}`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const _downloadBrokerFile = (params: { url: string }) => {
  return get('/usercenter/api/common/file/download', {
    params,
    responseType: 'blob',
  });
};

export const _previewDocument = (params: { type: string; taskId: string }) => {
  return post('/usercenter/pipeline/application/preview', params);
};

export const _fetchLegalFile = (taskId: string) => {
  return get(`/usercenter/pipeline/application/legalPdf/${taskId}`);
};

export const _fetchBrokerIsApproval = () => {
  return get('/usercenter/pipeline/application/tips');
};

// delete
export const _fetchPipelineStatus = () => {
  return get('/usercenter/pipeline/approve/status');
};

export const _deleteProcess = (processInsId: string) => {
  return del(`/processes/${processInsId}`);
};

export const _submitPipelineTask = () => {
  return post('/usercenter/pipeline/application/submit');
};
