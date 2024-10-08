import { TaskFiles } from '@/types';

// tasks
export enum DashboardTaskKey {
  // common
  borrower = 'BORROWER',
  co_borrower = 'CO_BORROWER',
  demographics = 'DEMOGRAPHICS',
  real_investment = 'REAL_INVESTMENT',
  title_escrow = 'TITLE_ESCROW',
  //
  holdback_process = 'HOLDBACK_PROCESS',
  //
  rehab_info = 'REHAB_INFO',
  //
  payoff_amount = 'PAYOFF_AMOUNT',
  //
  referring_broker = 'REFERRING_BROKER',
}

export interface DashboardTasksResponse {
  [DashboardTaskKey.borrower]: boolean;
  [DashboardTaskKey.co_borrower]: boolean;
  [DashboardTaskKey.demographics]: boolean;
  [DashboardTaskKey.real_investment]: boolean;
  [DashboardTaskKey.title_escrow]: boolean;
  [DashboardTaskKey.holdback_process]?: boolean;
  [DashboardTaskKey.rehab_info]?: boolean;
  [DashboardTaskKey.referring_broker]?: boolean;
  [DashboardTaskKey.payoff_amount]?: boolean;
}

// appraisal
export interface DashboardPaymentDetailsResponse {
  borrowerName?: string;
  clientSecret: string;
  paymentAmount: number;
  appraisalFees: null | number;
  expeditedFees: null | number;
  isExpedited: boolean;
  propertyAddress: string;
  productName: string;
  paymentName: null | string;
  isAdditional?: boolean;
  orderNo: string;
}

export enum DashboardDocumentStatus {
  flag = 'FLAG',
  approve = 'APPROVE',
  in_review = 'IN_REVIEW',
}

// documents
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
      status: DashboardDocumentStatus;
    }[];
    collapse: boolean;
    categoryKey: string;
    categoryName: string;
    redDotFlag: boolean;
  }[];
  isTips: boolean;
  loanNumber: string;
}

export interface DashboardDocumentComment {
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  backgroundColor: string;
  note: string;
  operationTime: string | null;
}

export interface DashboardDocumentCommentsResponse {
  content: DashboardDocumentComment[];
}

// teams
export interface TeamMemberData {
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
  position: string;
}

export interface DashboardTeamResponse {
  loanOfficers: TeamMemberData[];
  email: string;
  phone: string;
  workingDays: string;
  workingHours: string;
}
