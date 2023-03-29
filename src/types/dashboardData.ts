import { LoanStage, LoanType } from '@/types/enum';
import { Options } from '@/types/options';
import {
  BorrowerDebtSummaryData,
  BPEstimateRateData,
  BREstimateRateData,
  BridgeStartingData,
  FinancialSituationData,
  MRStartingData,
  MRWhyRefinanceData,
  PropertyNewData,
  StartingData,
} from '@/types/variable';

// overview
export type OverviewData<T extends OverviewSummaryData = any> = {
  applicationType: string;
  closingCost: OverviewClosingCostData;
  summary: T;
  product: RatesProductData;
  loanDetail?: OverviewBridgeLoanDetail;
  thirdParty?: OverviewBridgeThirdParty;
};

export interface OverviewClosingCostData {
  estimatedTotal: number;
  lenderCost: number;
  requiredCost: number;
}

export type OverviewBridgeLoanDetail = {
  amortization: string;
  propertyType: Options.PropertyOpt;
  closeDate: string;
  penalty: number;
  lien: string;
  arv: number;
  ltc: number;
  ltv: number;
};

export type OverviewBridgeThirdParty = {
  totalClosingCash: number;
  downPayment?: number;
  originationFee: number;
  originationFeePer: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
};

export type OverviewSummaryData =
  | OverviewMRSummaryData
  | OverviewMPSummaryData
  | OverviewBPSummaryData
  | OverviewBRSummaryData;

type OverviewBaseSummaryData = {
  loanAmount: number;
};

export type OverviewMPSummaryData = OverviewBaseSummaryData & {
  purchasePrice: number;
  downPayment: number;
  expiredDate: string;
};

export type OverviewMRSummaryData = OverviewBaseSummaryData & {
  cashOut: number;
  balance: number;
  homeValue: number;
  address: string;
};

export type OverviewBPSummaryData = OverviewBaseSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
};

export type OverviewBRSummaryData = OverviewBaseSummaryData & {
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

export type SummaryFinancialSituation = FinancialSituationData & {
  assetsTotal: number;
};

// rate
export type RatesProductMap = Partial<Record<LoanType, RatesProductData[]>>;

// todo , lee  need to give more specific values.
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

export type RatesMPLoanInfo = PropertyNewData &
  Pick<StartingData, 'propertyOpt' | 'numberOfUnits'> & {
    percent?: number;
  };

export type RatesMRLoanInfo = Pick<
  MRStartingData,
  'propertyOpt' | 'homeValue'
> &
  Pick<MRWhyRefinanceData, 'cashOut'> & {
    taxAndInsurance: string;
    upfrontCost: string;
    balance: number;
  };

export type RatesBPLoanInfo = Pick<
  BPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type RatesBRLoanInfo = Pick<
  BREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

// pre-approval letter

type PreApprovalLetterBaseData = {
  // this three variable just for adapt for request
  applicationType?: string;
  loanAmount?: number;
  loanStage?: LoanStage;
};

export type PreApprovalLetterMPData = PreApprovalLetterBaseData &
  PropertyNewData &
  Pick<StartingData, 'propertyOpt' | 'numberOfUnits' | 'propAddr'>;

export type PreApprovalLetterBPData = PreApprovalLetterBaseData &
  BPEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type PreApprovalLetterBRData = PreApprovalLetterBaseData &
  BREstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

// task
