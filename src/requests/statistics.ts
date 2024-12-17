import { get } from '@/requests/axios';

export const _recordUrlTrigger = (params: {
  loanId: number | string;
  pageUrl: string;
  tenantId: string;
  userId: string;
  isFail: 'true' | 'false';
}) => {
  return get('/pos/api/events/track', {
    params,
  });
};
