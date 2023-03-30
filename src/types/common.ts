import { User } from '@/types/user';
import {
  BorrowerDebtRecordData,
  BorrowerDebtSummaryData,
  MortgageAboutOtherRelationData,
  MortgageApplicationProcessSnapshot,
  MortgageAssetsData,
  MortgageBorrowerData,
  MortgageFinancialSituationData,
  MortgageLoanLockFeeData,
  MortgagePropertyNewData,
  MortgagePropertyOwnData,
  MortgageStartingData,
  MRMonthlyPaymentData,
  MRResidenceOwnData,
  MRStartingData,
  MRWhyRefinanceData,
} from '@/types/morgtage';
import {
  BPEstimateRateData,
  BREstimateRateData,
  BridgeApplicationProcessSnapshot,
  BridgeStartingData,
  WhereKnowUsData,
} from '@/types/bridge';

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
}

export interface SelfInfoData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date | string;
  ssn: string;
  propAddr: AddressData;
  authorizedCreditCheck: boolean;
  email: string;
}

export interface SalaryIncomeData {
  timeunit: TimeUnit;
  salary: number;
  overtime: number;
  commission: number;
  bonus: number;
  rsu: number;
  other: number;
}

export interface SelfEmployIncomeData {
  timeunit: TimeUnit;
  shareProfit: number;
  selfPay: number;
}

export interface OtherIncomeData {
  timeunit: TimeUnit;
  socialSecurity: number;
  pension: number;
  disability: number;
  childSupport: number;
  alimony: number;
  other: number;
}

export type IncomeData =
  | SalaryIncomeData
  | SelfEmployIncomeData
  | OtherIncomeData;

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
  | MortgageBorrowerData
  // mortgage refinance
  | MRStartingData
  | MRMonthlyPaymentData
  | MRWhyRefinanceData
  | MRResidenceOwnData
  // bridge
  | BridgeApplicationProcessSnapshot
  | BridgeStartingData
  | BPEstimateRateData
  | BREstimateRateData;
