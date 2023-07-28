import {
  FixStartingData,
  FPEstimateRateData,
  FREstimateRateData,
} from '@/types/application';
import {
  BaseOverviewSummaryData,
  BasePreApprovalLetterData,
  DashboardTaskInfo,
} from '@/types';

export type FPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
};

export type FROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type FPRatesLoanInfo = Pick<
  FPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FRRatesLoanInfo = Pick<
  FREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FPPreApprovalLetterData = BasePreApprovalLetterData &
  FPEstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type FRPreApprovalLetterData = BasePreApprovalLetterData &
  FREstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type FPDashboardTaskKey =
  | 'FP_APPLICATION_LOAN'
  | 'FP_APPLICATION_PROPERTY'
  | 'FP_APPLICATION_INVESTMENT'
  | 'FP_BORROWER_PERSONAL'
  | 'FP_BORROWER_DEMOGRAPHICS'
  | 'FP_BORROWER_CO_BORROWER'
  | 'FP_BORROWER_GUARANTOR'
  | 'FP_APPRAISAL_PROPERTY_DETAILS'
  | 'FP_THIRD_CLOSING'
  | 'FP_THIRD_INSURANCE'
  | 'FP_DOCUMENTS_CONTRACT'
  | 'FP_DOCUMENTS_PICTURES'
  | 'FP_DOCUMENTS_REVIEW'
  | 'FP_DOCUMENTS_DOCUMENTS'
  | 'FP_APPRAISAL_COST';

export type FRDashboardTaskKey =
  | 'FR_APPLICATION_LOAN'
  | 'FR_APPLICATION_PROPERTY'
  | 'FR_APPLICATION_INVESTMENT'
  | 'FR_BORROWER_PERSONAL'
  | 'FR_BORROWER_DEMOGRAPHICS'
  | 'FR_BORROWER_CO_BORROWER'
  | 'FR_BORROWER_GUARANTOR'
  | 'FR_APPRAISAL_PROPERTY_DETAILS'
  | 'FR_THIRD_CLOSING'
  | 'FR_THIRD_INSURANCE'
  | 'FR_DOCUMENTS_CONTRACT'
  | 'FR_DOCUMENTS_PICTURES'
  | 'FR_DOCUMENTS_REVIEW'
  | 'FR_DOCUMENTS_DOCUMENTS'
  | 'FR_APPRAISAL_COST';

export type FixDashboardTaskMap<
  T extends FPDashboardTaskKey | FRDashboardTaskKey,
> = Record<T, DashboardTaskInfo>;

export interface FixDashboardLoanTask {
  processId: string;
  stage: string;
  tasks: FixDashboardTaskMap<FPDashboardTaskKey & FRDashboardTaskKey>;
  totalNum: number;
  finishedNum: number;
}
