import { User } from '@/types/user';
import {
  BorrowerData,
  BorrowerDebtRecordData,
  BorrowerDebtSummaryData,
  BPEstimateRateData,
  BREstimateRateData,
  BridgeApplicationProcessSnapshot,
  BridgeStartingData,
  FixApplicationProcessSnapshot,
  FixStartingData,
  FPEstimateRateData,
  FREstimateRateData,
  IncomeData,
  MortgageAboutOtherRelationData,
  MortgageApplicationProcessSnapshot,
  MortgageAssetsData,
  MortgageFinancialSituationData,
  MortgageLoanLockFeeData,
  MortgagePropertyNewData,
  MortgagePropertyOwnData,
  MortgageStartingData,
  MRMonthlyPaymentData,
  MRResidenceOwnData,
  MRStartingData,
  MRWhyRefinanceData,
  SelfInfoData,
  WhereKnowUsData,
} from '@/types/application';

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
}

export type EstateAgent = User.BaseUserInfo;

export interface Encompass {
  loanId: string;
  applicationId: string;
  borrowerAltId: string;
  coBorrowerAltId: string;
  status: 'Locked' | 'Locking' | 'Unlocked';
  currentLockDate?: string;
  currentLockExpires?: string;
  currentNumberOfDays?: string;
}

export type VariableValue =
  | EstateAgent
  | Encompass
  | SelfInfoData
  | IncomeData
  | BorrowerData
  | BorrowerDebtSummaryData
  | BorrowerDebtRecordData
  | WhereKnowUsData
  // mortgage
  | MortgageApplicationProcessSnapshot
  | MortgageStartingData
  | MortgagePropertyNewData
  | MortgageLoanLockFeeData
  | MortgageAssetsData
  | MortgagePropertyOwnData
  | MortgageAboutOtherRelationData
  | MortgageFinancialSituationData
  // mortgage refinance
  | MRStartingData
  | MRMonthlyPaymentData
  | MRWhyRefinanceData
  | MRResidenceOwnData
  // bridge
  | BridgeApplicationProcessSnapshot
  | BridgeStartingData
  | BPEstimateRateData
  | BREstimateRateData
  // fix and flip
  | FixApplicationProcessSnapshot
  | FixStartingData
  | FPEstimateRateData
  | FREstimateRateData;

export enum LoanSnapshot {
  select_product = 'SELECT_PRODUCT',
  starting_question = 'STARTING_QUESTION',
  estimate_rate = 'ESTIMATE_RATE',
  background_information = 'BACKGROUND_INFORMATION',
  loan_summary = 'LOAN_SUMMARY',
  loan_overview = 'LOAN_OVERVIEW',
}
