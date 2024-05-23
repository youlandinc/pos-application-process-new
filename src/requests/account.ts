import { get, post, put } from '@/requests/axios';
import { AccountUserChangePasswordParams, AccountUserInfo } from '@/types';

export const _uploadUserInfoAvatar = (files: FormData) => {
  return put('/usercenter/api/common/file/upload', files, {
    headers: { 'content-type': 'multipart/form-data' },
  });
};

export const _updateUserInfoAvatar = (param: {
  avatar: AccountUserInfo['avatar'];
}) => {
  return post('/usercenter/api/user/modifyUserInfo', param);
};

export const _fetchUserInfo = () => {
  return get('/usercenter/api/consumer/user/fetch');
};

export const _updateUserInfo = (params: AccountUserInfo) => {
  return post('/usercenter/api/user/modifyUserInfo', params);
};

export const _updateUserInfoPassword = (
  params: AccountUserChangePasswordParams,
) => {
  return post('/usercenter/api/consumer/changePassword/user/complete', params);
};
