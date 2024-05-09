import { TaskFiles } from '@/types';

export interface DashboardDocumentsResponse {
  docs: {
    id: number;
    categoryDocs: {
      fileKey: string;
      fileName: string;
      files: TaskFiles[];
      id: number;
      templateName: string;
      templateUrl: string;
    }[];
    collapse: boolean;
    categoryKey: string;
    categoryName: string;
  }[];
  isTips: boolean;
}

export enum DashboardTaskKey {
  borrower = 'BORROWER',
  co_borrower = 'CO_BORROWER',
  demographics = 'DEMOGRAPHICS',
  real_investment = 'REAL_INVESTMENT',
  title_escrow = 'TITLE_ESCROW',
  holdback_process = 'HOLDBACK_PROCESS',
}

export interface DashboardTasksResponse {
  [DashboardTaskKey.borrower]: boolean;
  [DashboardTaskKey.co_borrower]: boolean;
  [DashboardTaskKey.demographics]: boolean;
  [DashboardTaskKey.real_investment]: boolean;
  [DashboardTaskKey.title_escrow]: boolean;
  [DashboardTaskKey.holdback_process]?: boolean;
}
