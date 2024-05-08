import { del, put } from '@/requests/axios';
import { TaskFiles } from '@/types';

export const _uploadFile = (params: FormData, loanId: string) => {
  return put<TaskFiles[]>(`/pos/task/file/${loanId}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const _deleteFile = (
  loanId: string,
  params: { fileKey: string; fileUrl: string | undefined },
) => {
  return del(`/pos/task/file/${loanId}`, {
    data: params,
  });
};
