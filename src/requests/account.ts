import { del, get, post, put } from '@/requests/axios';
import {
  AccountRoleTaskKey,
  AccountUserChangePasswordParams,
  AccountUserProfileParams,
  DomainVerifyData,
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

export const _updateUserInfo = (params: Partial<AccountUserProfileParams>) => {
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

// payment link

export const _updatePaymentLinkLogo = (files: FormData) => {
  return post('/usercenter/account/link/logo', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

// payment link custom domain
// GET       api/domain/record         这个的domain 刷新的接口
// POST      api/domain/verifyRecord   新增   {"domainName":"", "personal":true}
// POST      api/domain/liveRecord     获取records   {"domainName":""}
// POST      api/domain/verify         verify ownership   {"domainName":"", "recordType":"", "recordName":"", "recordData":""}

export const _fetchCustomDomains = () => {
  return get('/usercenter/api/domain/record');
};

export const _addOrFetchCustomDomain = (params: { domainName: string }) => {
  return post('/usercenter/api/domain/verifyRecord', {
    ...params,
    personal: true,
  });
};

export const _verifyCustomDomain = (params: DomainVerifyData) => {
  return post('/usercenter/api/domain/verify', params);
};

export const _fetchLiveRecords = (params: { domainName: string }) => {
  return post('/usercenter/api/domain/liveRecord', params);
};

export const _deleteCustomDomain = (params: { id: string | number }) => {
  return del('/usercenter/api/domain/delete', { data: params });
};

// payment link custom email domain
// POST      api/customEmail    新增   {"domain":""}
// POST      api/customEmail/modify    修改邮箱名   {"id":"","username":""}
// POST      api/customEmail/identities    {"domain":""}
// POST      api/customEmail/verify   验证 {"domain":""}
// GET       api/customEmail/broker

export const _fetchCustomEmailDomains = () => {
  return get('/usercenter/api/customEmail/broker');
};

export const _addCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail', { ...params, personal: true });
};

export const _fetchIdentityCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail/identities', params);
};

export const _verifyCustomEmailDomain = (params: { domain: string }) => {
  return post('/usercenter/api/customEmail/verify', params);
};

export const _modifyCustomEmailDomain = (params: {
  id: number;
  userName: string;
}) => {
  return post('/usercenter/api/customEmail/modify', params);
};

export const _deleteCustomEmailDomain = (id: number | string) => {
  return del(`/usercenter/api/customEmail/${id}`);
};
