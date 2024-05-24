import { get, post, put } from '@/requests/axios';
import {
  AccountUserChangePasswordParams,
  AccountUserProfileParams,
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
