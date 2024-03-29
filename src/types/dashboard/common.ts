import {
  BPDashboardTaskKey,
  BRDashboardTaskKey,
  FPDashboardTaskKey,
  FRDashboardTaskKey,
  GPDashboardTaskKey,
  GPOverviewSummaryData,
  GRDashboardTaskKey,
  GROverviewSummaryData,
  PropertyOpt,
} from '@/types';
import { LoanStage, LoanType } from '@/types/enum';
import { BorrowerDebtSummaryData } from '@/types/application';
import {
  BPOverviewSummaryData,
  BROverviewSummaryData,
  FPOverviewSummaryData,
  FROverviewSummaryData,
  MPOverviewSummaryData,
  MROverviewSummaryData,
} from '@/types/dashboard';

// overview
export type OverviewData<T extends OverviewSummaryData = any> = {
  applicationType: string;
  closingCost: OverviewClosingCostData;
  summary: T;
  product: RatesProductData;
  loanDetail?: BaseOverviewDetail;
  thirdParty?: BaseOverviewThirdParty;
};

export type BaseOverviewDetail = {
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  penalty: number;
  lien: string;
  arv: number;
  ltc: number;
  ltv?: number;
};

export type BaseOverviewThirdParty = {
  totalClosingCash: number;
  downPayment?: number;
  originationFee: number;
  originationFeePer: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
  // broker
  brokerPoints: number;
  brokerOriginationFee: number;
  brokerProcessingFee: number;
  // lender
  lenderPoints: number;
  lenderOriginationFee: number;
  lenderProcessingFee: number;
  // officer
  officerPoints: number;
  officerOriginationFee: number;
  officerProcessingFee: number;
  // agent
  agentFee: number;
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
  | BROverviewSummaryData
  | FROverviewSummaryData
  | FPOverviewSummaryData
  | GROverviewSummaryData
  | GPOverviewSummaryData;

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
  totalClosingCash: number;
  proRatedInterest: number;

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

interface DashboardTaskItem<
  T extends
    | BPDashboardTaskKey
    | BRDashboardTaskKey
    | FPDashboardTaskKey
    | FRDashboardTaskKey
    | GPDashboardTaskKey
    | GRDashboardTaskKey,
> {
  title: string;
  children: Array<{ code: T; url: string }>;
}

export interface DashboardTaskList<
  T extends
    | BPDashboardTaskKey
    | BRDashboardTaskKey
    | FPDashboardTaskKey
    | FRDashboardTaskKey
    | GPDashboardTaskKey
    | GRDashboardTaskKey,
> {
  ApplicationInformation: DashboardTaskItem<T>;
  BorrowerInformation: DashboardTaskItem<T>;
  PropertyAppraisal: DashboardTaskItem<T>;
  ThirdPartyInformation: DashboardTaskItem<T>;
  DocumentsMaterials: DashboardTaskItem<T>;
  // SetUpAutoPay: DashboardTaskItem<T>;
}

export interface DashboardTaskInfo {
  taskId: string;
  taskName: string;
  taskForm: null;
  finished: boolean;
  totalNum: null | number;
  uploadedNum: null | number;
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
  trust = 'TRUST',
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

export enum DashboardTaskPrimaryReasonRefinance {
  no_cash_out = 'NO_CASH_OUT',
  delayed_purchase_refinance = 'DELAYED_PURCHASE_REFINANCE',
  currently_rent_out = 'CURRENTLY_RENT_OUT',
  finish_property_rehab = 'FINISH_PROPERTY_REHAB',
  buy_other_property = 'BUY_OTHER_PROPERTY',
  other = 'OTHER',
}

export enum DashboardTaskExitStrategy {
  rehab_and_sell = 'REHAB_AND_SELL',
  rehab_rent_refinance = 'REHAB_RENT_REFINANCE',
  obtain_long_term_financing = 'OBTAIN_LONG_TERM_FINANCING',
}

export enum DashboardTaskInstructions {
  title_officer = 'TITLE_OFFICER',
  issuing_agent = 'ISSUING_AGENT',
  closing_attorney = 'CLOSING_ATTORNEY',
}

export enum DashboardTaskLoanClosing {
  escrow_company = 'ESCROW_COMPANY',
  closing_attorney = 'CLOSING_ATTORNEY',
}

export enum DashboardTaskAutomaticPayment {
  plaid = 'PLAID',
  ach_debit = 'ACH_DEBIT',
}

export enum DashboardTaskPaymentTableStatus {
  notice = 'NOTICE',
  summary = 'SUMMARY',
  payment = 'PAYMENT',
}

export enum DashboardTaskPaymentMethodsStatus {
  undone = 'UNDONE',
  processing = 'PROCESSING',
  complete = 'COMPLETE',
  fail = 'FAIL',
}

export interface CustomRateData {
  customRate?: boolean | undefined;
  interestRate?: number | undefined;
  loanTerm?: number | undefined;
}
