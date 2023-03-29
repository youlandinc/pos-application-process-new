import {
  DebtWrongReasonOpt,
  DenialReason,
  OccupancyOpt,
  OfferOpt,
  PropertyOpt,
  PropPlanOpt,
  PropPurposeOpt,
  PropTitleOpt,
  PurchaseTimeOpt,
  RelationshipOpt,
  StageOpt,
  UnitOpt,
  WhyRefinanceOpt,
} from '@/types/options'

import { Options } from './options'

import {
  AssetsState,
  BridgeCreditScoreState,
  BridgePurchaseState,
  BridgeRefinanceState,
  CreditScoreState,
  DTIState,
  MortgagePurchaseState,
  MortgageRefinanceAssetsState,
  MortgageRefinanceState,
  StartingState,
} from '@/types/enum'

import { User } from './user'
import { LoanType } from '@/types/enum'

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
}

export interface WhereKnowUsData {
  reference: Options.ChannelOpt;
}

interface BaseMortgageStartingData {
  occupancyOpt: OccupancyOpt;
  propertyOpt: PropertyOpt;
  numberOfUnits: UnitOpt;
  propAddr: AddressData;
  rentalIncome: number | undefined;
}

export interface StartingData extends BaseMortgageStartingData {
  stageOpt: StageOpt;
  offerOpt: OfferOpt;
  purchaseTimeOpt: PurchaseTimeOpt;
}

export interface PropertyNewData {
  purchasePrice: number;
  downPayment: number;
}

export interface LoanLockFeeData {
  fee: {
    id: string;
    disabled: boolean;
    locked: boolean;
    caption: string;
    receiver: string;
    amount: number;
  };
  payment: {
    id: string;
    feeId: string;
    amount: number;
    receiver: string;
    caption: string;
    payer: string;
    paid: boolean;
    paidId: string;
    paidTime: string;
    receipt: string;
    logs: string;
  };
}

export interface BaseLoanData {
  paymentSchedule: TimeUnit;
  caption: string;
  isPrimary: boolean;
  includedTaxAndIns: boolean;
  balance: number;
  payment: number;
}

export interface BaseAssetsData {
  propAddr: AddressData;
  propertyPurpose: PropPurposeOpt;
  expectRentPrice: number | undefined;
  propertyTitle: PropTitleOpt;
  hasMonthlyPayment: boolean | undefined;
  changeResidence: boolean | undefined;
  payments: Record<string, BaseLoanData>;
}

export interface AssetsData extends BaseAssetsData {
  propertyPlan: PropPlanOpt;
  sellForPurchaseNew: boolean;
  isCurrentEstate: boolean | undefined;
  expectSellPrice: number | undefined;
  interestedRefinancing: boolean | undefined;
}

export interface PropertyOwnData {
  assets: Record<string, AssetsData>;
  // new addition attr for next button disabled, lee
  ownCurrentEstate: boolean | undefined;
  ownOtherEstate: boolean | undefined;
  everOwnedEstate: boolean | undefined;
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

export type IncomeData =
    | SalaryIncomeData
    | SelfEmployIncomeData
    | OtherIncomeData;

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

export interface AboutOtherRelationData {
  isOnTheTitle: boolean;
  isCoBorrower: boolean;
  relationshipOpt: RelationshipOpt;
  togetherCurrently: boolean;
  togetherInNewHome: boolean;
  readyEnter: boolean;
}

export interface FinancialSituationData {
  giftFromRelative: number;
  loanAmount: number;
  other: number;
  retirementAccount: number;
  salesOfRealEstate: number;
  savingAccount: number;
  stockAndBonds: number;
}

export interface BorrowerData {
  reconciled: boolean;
  preApproved: boolean;
  denialReason: DenialReason;
  debtMonthly: number;
  grossIncomeMonthly: number;
  creditScore: number;
  loanAmountMax: number;
}

export interface DebtData {
  id: string;
  receiver: string;
  balance: number;
  payment: number;
  paymentSchedule: TimeUnit;
}

export interface RecordDebtData extends DebtData {
  canPayoff?: boolean;
  disabled?: boolean;
  wrongReason?: DebtWrongReasonOpt | undefined;
  consolidate?: undefined | boolean;
}

export interface BorrowerDebtSummaryData {
  payments: Record<string, DebtData>;
}

export interface BorrowerDebtRecordData {
  payments: Record<string, RecordDebtData>;
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

export interface ApplicationProcessSnapshot {
  applicationType: ApplicationType;
  productCategory: ProductCategory;
  starting: {
    state: StartingState;
  };
  creditScore: {
    state: CreditScoreState;
  };
  assets: {
    state: AssetsState | MortgageRefinanceAssetsState;
  };
  DTI: {
    state: DTIState;
  };
  state: MortgagePurchaseState | MortgageRefinanceState;
}

// mortgage refinance

export interface MRStartingData extends BaseMortgageStartingData {
  homeValue: number;
}

export interface MonthlyPaymentLoan {
  caption: string;
  balance: number;
  payment: number;
  isPrimary: boolean;
  includedTaxAndIns: boolean;
  refinance: boolean;
  loanType: LoanType;
  loanRate: number;
}

export interface MRMonthlyPaymentData {
  hasMonthlyPayment: boolean;
  aboutYourLoans: Record<string, MonthlyPaymentLoan>;
}

export interface MRWhyRefinanceData {
  purpose: WhyRefinanceOpt;
  cashOut: number;
}

export interface MRYourPropertyData {
  assets: Record<string, BaseAssetsData>;
}

export interface MRResidenceOwnData {
  ownCurrentEstate: boolean;
  propertyTitle: PropTitleOpt;
  hasMonthlyPayment: boolean;
  payments: Record<string, BaseLoanData>;
}

// bridge

export interface BridgeStartingData {
  propertyNumber: Options.BridgePropertyNumberOpt;
  isConfirm: boolean | undefined;
  propertyType: PropertyOpt;
  propertyUnit: UnitOpt;
  propAddr: AddressData;
}

export interface BPEstimateRateData {
  purchasePrice: number | undefined;
  purchaseLoanAmount: number | undefined;
  isCor: boolean;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
}

export interface BREstimateRateData {
  homeValue: number | undefined;
  balance: number | undefined;
  isCashOut: boolean;
  cashOutAmount: number | undefined;
  isCor: boolean;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
}

export interface BApplicationProcessSnapshot {
  applicationType: ApplicationType;
  productCategory: ProductCategory;
  starting: {
    state: StartingState;
  };
  creditScore: {
    state: BridgeCreditScoreState;
  };
  state: BridgePurchaseState | BridgeRefinanceState;
}

export type VariableValue =
    | WhereKnowUsData
    | BorrowerDebtSummaryData
    | BorrowerData
    | FinancialSituationData
    | AboutOtherRelationData
    | OtherIncomeData
    | SelfEmployIncomeData
    | SalaryIncomeData
    | SelfInfoData
    | PropertyOwnData
    | LoanLockFeeData
    | PropertyNewData
    | StartingData
    | ApplicationProcessSnapshot
    | EstateAgent
    | BorrowerDebtRecordData
    | Encompass
    // refinance
    | MRStartingData
    | MRMonthlyPaymentData
    | MRResidenceOwnData
    | MRWhyRefinanceData
    // bridge
    | BridgeStartingData
    | BPEstimateRateData
    | BREstimateRateData;
