import {
  GPEstimateRateData,
  GREstimateRateData,
  GroundStartingData,
} from '@/types/application';
import {
  BaseOverviewSummaryData,
  BasePreApprovalLetterData,
  DashboardTaskInfo,
} from '@/types';

export type GPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
};

export type GROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type GPRatesLoanInfo = Pick<
  GPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type GRRatesLoanInfo = Pick<
  GREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type GPPreApprovalLetterData = BasePreApprovalLetterData &
  GPEstimateRateData &
  Pick<GroundStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type GRPreApprovalLetterData = BasePreApprovalLetterData &
  GREstimateRateData &
  Pick<GroundStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type GPDashboardTaskKey =
  | 'GP_APPLICATION_LOAN'
  | 'GP_APPLICATION_PROPERTY'
  | 'GP_APPLICATION_INVESTMENT'
  | 'GP_BORROWER_PERSONAL'
  | 'GP_BORROWER_DEMOGRAPHICS'
  | 'GP_BORROWER_CO_BORROWER'
  | 'GP_BORROWER_GUARANTOR'
  | 'GP_APPRAISAL_PROPERTY_DETAILS'
  | 'GP_THIRD_CLOSING'
  | 'GP_THIRD_INSURANCE'
  | 'GP_DOCUMENTS_CONTRACT'
  | 'GP_DOCUMENTS_PICTURES'
  | 'GP_DOCUMENTS_REVIEW'
  | 'GP_DOCUMENTS_DOCUMENTS'
  | 'GP_APPRAISAL_COST';

export type GRDashboardTaskKey =
  | 'GR_APPLICATION_LOAN'
  | 'GR_APPLICATION_PROPERTY'
  | 'GR_APPLICATION_INVESTMENT'
  | 'GR_BORROWER_PERSONAL'
  | 'GR_BORROWER_DEMOGRAPHICS'
  | 'GR_BORROWER_CO_BORROWER'
  | 'GR_BORROWER_GUARANTOR'
  | 'GR_APPRAISAL_PROPERTY_DETAILS'
  | 'GR_THIRD_CLOSING'
  | 'GR_THIRD_INSURANCE'
  | 'GR_DOCUMENTS_CONTRACT'
  | 'GR_DOCUMENTS_PICTURES'
  | 'GR_DOCUMENTS_REVIEW'
  | 'GR_DOCUMENTS_DOCUMENTS'
  | 'GR_APPRAISAL_COST';

export type GroundDashboardTaskMap<
  T extends GPDashboardTaskKey | GRDashboardTaskKey,
> = Record<T, DashboardTaskInfo>;

export interface GroundDashboardLoanTask {
  processId: string;
  stage: string;
  tasks: GroundDashboardTaskMap<GPDashboardTaskKey & GRDashboardTaskKey>;
  totalNum: number;
  finishedNum: number;
}
