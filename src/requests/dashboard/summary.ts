import { get } from '@/requests/axios';

export const _fetchSummaryData = (processInsId = '') => {
  return get<any>(`/dashboard/application/summary/${processInsId}`);
};
