import { TaskFiles } from '@/types';
import { get, post, put, del } from './axios';
import { ServerTaskKey } from '@/types/enum';

export const _getTask = (taskId: string) => {
  return get<TaskData>(`/tasks/${taskId}`);
};

export const _updateTask = (
  taskId: string,
  action: 'change' | 'complete',
  newActivityKey?: ServerTaskKey,
) => {
  return post<TaskData[]>(`/tasks/${taskId}`, { action, newActivityKey });
};

export const _updateTaskVariables = (
  taskId: string,
  variables: Variable<any>[],
  overwrite = true,
) => {
  return put<BaseResponse & { taskId: string }>(`/tasks/${taskId}/variables`, {
    overwrite,
    taskId,
    variables,
  });
};

export const _TaskFile = (params: FormData, taskId: string) => {
  return put<TaskFiles[]>(`/dashboard/loan/task/${taskId}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const _DelTaskFile = (
  taskId: string,
  params: { fieldName: string; fileUrl: string },
) => {
  return del(`/dashboard/loan/task/${taskId}`, {
    data: params,
  });
};
