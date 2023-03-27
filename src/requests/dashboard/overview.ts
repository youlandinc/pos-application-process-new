import { get } from '../axios';
import { PreApprovalLetterData } from '@/types/server';
import { OverviewData, OverviewSummaryData } from '@/types/dashboardData';

export const _fetchPreApprovalLetterData = (processId: string) => {
  return get<PreApprovalLetterData>(`/dashboard/letter/${processId}`);
};

export const _fetchOverviewLoanSummary = <T extends OverviewSummaryData = any>(
  processId: string,
) => {
  return get<OverviewData<T>>(`/dashboard/overview/summary/${processId}`);
};
