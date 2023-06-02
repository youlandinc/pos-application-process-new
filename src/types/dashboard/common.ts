import { LoanStage, LoanType } from '@/types/enum';
import { BorrowerDebtSummaryData } from '@/types/application';
import {
  BPOverviewSummaryData,
  BridgeOverviewDetail,
  BridgeOverviewThirdParty,
  BROverviewSummaryData,
  MPOverviewSummaryData,
  MROverviewSummaryData,
} from '@/types/dashboard';

// overview
export type OverviewData<T extends OverviewSummaryData = any> = {
  applicationType: string;
  closingCost: OverviewClosingCostData;
  summary: T;
  product: RatesProductData;
  loanDetail?: BridgeOverviewDetail;
  thirdParty?: BridgeOverviewThirdParty;
};

export interface OverviewClosingCostData {
  estimatedTotal: number;
  lenderCost: number;
  requiredCost: number;
}

export type OverviewSummaryData =
  | MROverviewSummaryData
  | MPOverviewSummaryData
  | BPOverviewSummaryData
  | BROverviewSummaryData;

export type BaseOverviewSummaryData = {
  loanAmount: number;
};

export type OverviewBRSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
  isCashOut: boolean;
};

// summary
export interface SummaryIncomeData {
  incomeTotal: number;
  salaryIncome: number;
  otherIncome: number;
  selfEmployIncome: number;
}

export type SummaryDebts = BorrowerDebtSummaryData & { debtsTotal: number };

// rate
export interface RatesProductData {
  // common
  name: string;
  id: string;
  code: string;
  investor: string;
  interestRateOfYear: number;
  apr: number;
  points: number;
  paymentOfMonth: number;
  category: string;
  feature: LoanType;
  status: string;
  // unique identity just for product
  selected?: boolean;
  updated?: boolean;
  //bridge
  loanTerm?: number;
  //broker
  totalBorrowerFees?: number;
  totalBorrowerPoints?: number;
  // agent
  agentFee?: number;
}

export type RatesProductMap = Partial<Record<LoanType, RatesProductData[]>>;

// todo , lee  need to give more specific values.

// pre-approval letter

export type BasePreApprovalLetterData = {
  // this three variable just for adapt for request
  applicationType?: string;
  loanAmount?: number;
  loanStage?: LoanStage;
};

// task
export enum DashboardTaskKey {
  // bridge purchase
  BP_AL = 'BP_APPLICATION_LOAN',
  BP_AP = 'BP_APPLICATION_PROPERTY',
  BP_AI = 'BP_APPLICATION_INVESTMENT',

  BP_BP = 'BP_BORROWER_PERSONAL',
  BP_BD = 'BP_BORROWER_DEMOGRAPHICS',
  BP_BCB = 'BP_BORROWER_CO_BORROWER',
  BP_BG = 'BP_BORROWER_GUARANTOR',

  BP_AC = 'BP_APPRAISAL_COST',
  BP_APD = 'BP_APPRAISAL_PROPERTY_DETAILS',

  BP_TC = 'BP_THIRD_CLOSING',
  BP_TI = 'BP_THIRD_INSURANCE',

  BP_AA = 'BP_AUTOPAY_ACH',

  BP_DC = 'BP_DOCUMENTS_CONTRACT',
  BP_DP = 'BP_DOCUMENTS_PICTURES',
  BP_DR = 'BP_DOCUMENTS_REVIEW',
  BP_DD = 'BP_DOCUMENTS_DOCUMENTS',

  // bridge refinance
}

export enum DashboardTaskCitizenshipStatus {
  us_citizen = 'US_CITIZEN',
  permanent_resident_alien = 'PERMANENT_RESIDENT_ALIEN',
  non_permanent_resident_alien = 'NON_PERMANENT_RESIDENT_ALIEN',
}

export enum DashboardTaskMaritalStatus {
  unmarried = 'UNMARRIED',
  married = 'MARRIED',
  separated = 'SEPARATED',
}

export enum DashboardTaskBorrowerType {
  individual = 'INDIVIDUAL',
  entity = 'ENTITY',
}

export enum DashboardTaskBorrowerEntityType {
  limited_liability_company = 'LIMITED_LIABILITY_COMPANY',
  corporation = 'CORPORATION',
  limited_partnership = 'LIMITED_PARTNERSHIP',
  limited_company = 'LIMITED_COMPANY',
  individual = 'INDIVIDUAL',
}

export enum DashboardTaskGender {
  male = 'MALE',
  female = 'FEMALE',
  not_provide = 'NOT_PROVIDE',
}
