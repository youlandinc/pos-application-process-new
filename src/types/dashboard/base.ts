import { LoanSnapshotEnum, PipelineLoanStageEnum, TaskFiles } from '@/types';

// overview
export type PipelineLoanStageKey = `${PipelineLoanStageEnum}`;

export interface DashboardOverviewResponse {
  data: {
    estDate: string;
    loanStatus: PipelineLoanStageEnum;
    loanStatusDetails: {
      [key in PipelineLoanStageKey]: {
        date?: string;
        reason?: string;
      };
    };
    loanTasks: DashboardTasksResponse;
  };
  id: number | string;
  loanId: number | string;
  snapshot: LoanSnapshotEnum;
  isBind: boolean;
}

// tasks
export enum DashboardTaskKey {
  // loan information
  payoff_amount = 'PAYOFF_AMOUNT',
  rehab_info = 'REHAB_INFO',
  square_footage = 'SQUARE_FOOTAGE',
  entitlements = 'ENTITLEMENTS',
  permits_obtained = 'PERMITS_OBTAINED',
  // borrower information
  borrower = 'BORROWER',
  co_borrower = 'CO_BORROWER',
  demographics = 'DEMOGRAPHICS',
  // third party information
  title_escrow = 'TITLE_ESCROW',
  // Agreements
  holdback_process = 'HOLDBACK_PROCESS',
  // broker
  referring_broker = 'REFERRING_BROKER',
}

export interface DashboardTasksResponse {
  // loan information
  [DashboardTaskKey.payoff_amount]?: boolean;
  [DashboardTaskKey.rehab_info]?: boolean;
  [DashboardTaskKey.square_footage]?: boolean;
  [DashboardTaskKey.entitlements]?: boolean;
  [DashboardTaskKey.permits_obtained]?: boolean;
  // borrower information
  [DashboardTaskKey.borrower]: boolean;
  [DashboardTaskKey.co_borrower]: boolean;
  [DashboardTaskKey.demographics]: boolean;
  // third party information
  [DashboardTaskKey.title_escrow]: boolean;
  // Agreements
  [DashboardTaskKey.holdback_process]?: boolean;
  // broker
  [DashboardTaskKey.referring_broker]?: boolean;
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
  not_needed = 'NOT_NEEDED',
  uw_flag = 'UW_FLAG',
  dd_flag = 'DD_FLAG',
  exception_granted = 'EXCEPTION_GRANTED',
  approve = 'APPROVE',
  in_review = 'IN_REVIEW',
  waiting_for_review = 'WAITING_FOR_REVIEW',
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
