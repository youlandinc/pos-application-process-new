import { get } from '@/requests/axios';
import { User } from '@/types/user';

export const _fetchMyTeamData = () => {
  return get('/usercenter/api/tenant/query/fulfillConfig');
};

export const _fetchSaasConfig = () => {
  return get<User.TenantConfigRequest>(
    '/usercenter/api/tenant/query/configSaas',
  );
};
