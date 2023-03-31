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
