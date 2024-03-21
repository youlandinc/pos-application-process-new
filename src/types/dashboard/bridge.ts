import {
  BPEstimateRateData,
  BREstimateRateData,
  BridgeStartingData,
} from '@/types/application';
import {
  AppraisalStage,
  BaseOverviewSummaryData,
  BasePreApprovalLetterData,
  DashboardTaskInfo,
} from '@/types';

export type BPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  firstName: string;
  lastName: string;
  address: string;
};

export type BROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type BPRatesLoanInfo = Pick<
  BPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount'
> & {
  totalLoanAmount: number;
};

export type BRRatesLoanInfo = Pick<
  BREstimateRateData,
  'balance' | 'cashOutAmount'
> & {
  totalLoanAmount: number;
};

export type BPPreApprovalLetterData = BasePreApprovalLetterData &
  BPEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type BRPreApprovalLetterData = BasePreApprovalLetterData &
  BREstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type BPDashboardTaskKey =
  | 'BP_APPLICATION_LOAN'
  | 'BP_APPLICATION_PROPERTY'
  | 'BP_APPLICATION_INVESTMENT'
  | 'BP_BORROWER_PERSONAL'
  | 'BP_BORROWER_DEMOGRAPHICS'
  | 'BP_BORROWER_CO_BORROWER'
  | 'BP_BORROWER_GUARANTOR'
  | 'BP_APPRAISAL_PROPERTY_DETAILS'
  | 'BP_THIRD_CLOSING'
  | 'BP_THIRD_INSURANCE'
  | 'BP_DOCUMENTS_CONTRACT'
  | 'BP_DOCUMENTS_PICTURES'
  | 'BP_DOCUMENTS_REVIEW'
  | 'BP_DOCUMENTS_DOCUMENTS'
  | 'BP_APPRAISAL_COST';

export type BRDashboardTaskKey =
  | 'BR_APPLICATION_LOAN'
  | 'BR_APPLICATION_PROPERTY'
  | 'BR_APPLICATION_INVESTMENT'
  | 'BR_BORROWER_PERSONAL'
  | 'BR_BORROWER_DEMOGRAPHICS'
  | 'BR_BORROWER_CO_BORROWER'
  | 'BR_BORROWER_GUARANTOR'
  | 'BR_APPRAISAL_PROPERTY_DETAILS'
  | 'BR_THIRD_CLOSING'
  | 'BR_THIRD_INSURANCE'
  | 'BR_DOCUMENTS_CONTRACT'
  | 'BR_DOCUMENTS_PICTURES'
  | 'BR_DOCUMENTS_REVIEW'
  | 'BR_DOCUMENTS_DOCUMENTS'
  | 'BR_APPRAISAL_COST';

export type BridgeDashboardTaskMap<
  T extends BPDashboardTaskKey | BRDashboardTaskKey,
> = Record<T, DashboardTaskInfo>;

export interface BridgeDashboardLoanTask {
  processId: string;
  stage: string;
  tasks: BridgeDashboardTaskMap<BPDashboardTaskKey & BRDashboardTaskKey>;
  totalNum: number;
  finishedNum: number;
  appraisalStage: AppraisalStage;
}
