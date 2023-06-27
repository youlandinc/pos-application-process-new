import { ProcessesParams } from '@/types/process';
import { get, post, put } from './axios';
import { ProcessData } from '@/types/server';

export const _startProcess = (
  productName = 'mortgage',
  tenantId: string | number,
) => {
  return post<ProcessData>(`/processes/${productName}/${tenantId}`, {});
};

export const _fetchProcessData = (processInsId = '') => {
  return get<ProcessData>(`/processes/${processInsId}`);
};

export const _fetchProcessVariables = (processInsId: string) => {
  return get<ProcessData>(`/processes/${processInsId}/variables`);
};

export const _updateProcessVariables = (
  processInsId: string,
  variables: Array<Record<string, any>>,
  overwrite = true,
) => {
  return put<BaseResponse>(`/processes/${processInsId}/variables`, {
    processInsId,
    variables,
    overwrite,
  });
};

export const _bindProcess = (processInsId: string) => {
  return post<BaseResponse>(`/processes/${processInsId}/users/bind`);
};

export const _fetchAllProcesses = (params: ProcessesParams) => {
  return post<{ content: ProcessData[] } & any>(
    '/processes/user/application',
    params,
  );
};

// export const _fetchAllCommission = (params) => {
//   return post('/processes/commission', params);
// };
