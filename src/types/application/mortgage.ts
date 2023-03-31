import { Options } from '@/types/options';
import { AddressData } from '@/types/common';

import {
  AssetsState,
  CreditScoreState,
  DTIState,
  LoanType,
  MortgagePurchaseState,
  MortgageRefinanceAssetsState,
  MortgageRefinanceState,
  StartingState,
} from '@/types/enum';

export interface MortgageApplicationProcessSnapshot {
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

interface BaseMortgageStartingData {
  occupancyOpt: Options.OccupancyOpt;
  propertyOpt: Options.PropertyOpt;
  numberOfUnits: Options.PropertyUnitOpt;
  propAddr: AddressData;
  rentalIncome: number | undefined;
}

export interface MortgageStartingData extends BaseMortgageStartingData {
  stageOpt: Options.ProcessOpt;
  offerOpt: Options.OfferOpt;
  purchaseTimeOpt: Options.PurchaseTimeOpt;
}

export interface MortgagePropertyNewData {
  purchasePrice: number;
  downPayment: number;
}

export interface MortgageLoanLockFeeData {
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

export interface BaseMortgageAssetsData {
  propAddr: AddressData;
  propertyPurpose: Options.PropPurposeOpt;
  expectRentPrice: number | undefined;
  propertyTitle: Options.PropertyTitleOpt;
  hasMonthlyPayment: boolean | undefined;
  changeResidence: boolean | undefined;
  payments: Record<string, BaseLoanData>;
}

export interface MortgageAssetsData extends BaseMortgageAssetsData {
  propertyPlan: Options.PropertyPlanOpt;
  sellForPurchaseNew: boolean;
  isCurrentEstate: boolean | undefined;
  expectSellPrice: number | undefined;
  interestedRefinancing: boolean | undefined;
}

export interface MortgagePropertyOwnData {
  assets: Record<string, MortgageAssetsData>;
  // new addition attr for next button disabled, lee
  ownCurrentEstate: boolean | undefined;
  ownOtherEstate: boolean | undefined;
  everOwnedEstate: boolean | undefined;
}

export interface MortgageAboutOtherRelationData {
  isOnTheTitle: boolean;
  isCoBorrower: boolean;
  relationshipOpt: Options.RelationshipOpt;
  togetherCurrently: boolean;
  togetherInNewHome: boolean;
  readyEnter: boolean;
}

export interface MortgageFinancialSituationData {
  giftFromRelative: number;
  loanAmount: number;
  other: number;
  retirementAccount: number;
  salesOfRealEstate: number;
  savingAccount: number;
  stockAndBonds: number;
}

export interface MortgageBorrowerData {
  reconciled: boolean;
  preApproved: boolean;
  denialReason: Options.DenialReason;
  debtMonthly: number;
  grossIncomeMonthly: number;
  creditScore: number;
  loanAmountMax: number;
}

export interface MortgageDebtData {
  id: string;
  receiver: string;
  balance: number;
  payment: number;
  paymentSchedule: TimeUnit;
}

export interface MortgageRecordDebtData extends MortgageDebtData {
  canPayoff?: boolean;
  disabled?: boolean;
  wrongReason?: Options.DebtWrongReasonOpt | undefined;
  consolidate?: undefined | boolean;
}

export interface BorrowerDebtSummaryData {
  payments: Record<string, MortgageDebtData>;
}

export interface BorrowerDebtRecordData {
  payments: Record<string, MortgageRecordDebtData>;
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
  purpose: Options.WhyRefinanceOpt;
  cashOut: number;
}

export interface MRYourPropertyData {
  assets: Record<string, BaseMortgageAssetsData>;
}

export interface MRResidenceOwnData {
  ownCurrentEstate: boolean;
  propertyTitle: Options.PropertyTitleOpt;
  hasMonthlyPayment: boolean;
  payments: Record<string, BaseLoanData>;
}
