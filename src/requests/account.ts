import { del, get, post, put } from '@/requests/axios';
import {
  AccountRoleTaskKey,
  AccountUserChangePasswordParams,
  AccountUserProfileParams,
  TaskFiles,
} from '@/types';

export const _uploadUserInfoAvatar = (files: FormData) => {
  return put('/usercenter/api/common/file/upload', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const _updateUserInfoAvatar = (param: {
  avatar: AccountUserProfileParams['avatar'];
}) => {
  return post('/usercenter/api/user/modifyUserInfo', param);
};

export const _updateUserInfo = (params: AccountUserProfileParams) => {
  return post('/usercenter/api/user/modifyUserInfo', params);
};

export const _updateUserInfoPassword = (
  params: AccountUserChangePasswordParams,
) => {
  return post('/usercenter/api/consumer/changePassword/user/complete', params);
};

export const _fetchUerInfoWrapper = () => {
  return get('/usercenter/account/info');
};

// this is a base api
export const _fetchUserInfo = () => {
  return get('/usercenter/api/consumer/user/fetch');
};

// broker/agent/officer info

export const _uploadRoleTaskFile = (
  params: FormData,
  taskKey: AccountRoleTaskKey,
) => {
  return put<TaskFiles[]>(`/usercenter/account/info/${taskKey}/file`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const _deleteRoleTaskFile = (params: {
  taskKey: AccountRoleTaskKey;
  url: string;
}) => {
  return del('/usercenter/account/info/file', { data: params });
};

export const _generateRoleFile = (params: {
  taskKey: AccountRoleTaskKey;
  taskForm: any;
}) => {
  return put('/usercenter/account/info/legalPdf', params);
};

export const _previewRoleFile = (params: {
  taskKey: AccountRoleTaskKey;
  taskForm: any;
}) => {
  return post('/usercenter/account/info/file/preview', params);
};

export const _fetchRoleTaskDetail = (taskKey: AccountRoleTaskKey) => {
  return get(`/usercenter/account/info/${taskKey}`);
};

export const _updateRoleTaskDetail = (params: {
  taskKey: AccountRoleTaskKey;
  taskForm: any;
}) => {
  return post('/usercenter/account/info', params);
};
