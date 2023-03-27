import { get, post, put } from './axios';
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
  variables: Variable[],
  overwrite = true,
) => {
  return put<BaseResponse & { taskId: string }>(`/tasks/${taskId}/variables`, {
    overwrite,
    taskId,
    variables,
  });
};
