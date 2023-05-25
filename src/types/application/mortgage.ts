import {
  DebtWrongReasonOpt,
  OccupancyOpt,
  OfferOpt,
  ProcessOpt,
  PropertyOpt,
  PropertyPlanOpt,
  PropertyPurposeOpt,
  PropertyTitleOpt,
  PropertyUnitOpt,
  PurchaseTimeOpt,
  RelationshipOpt,
  WhyRefinanceOpt,
} from '@/types/options';
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
  occupancyOpt: OccupancyOpt;
  propertyOpt: PropertyOpt;
  numberOfUnits: PropertyUnitOpt;
  propAddr: AddressData;
  rentalIncome: number | undefined;
}

export interface MortgageStartingData extends BaseMortgageStartingData {
  stageOpt: ProcessOpt;
  offerOpt: OfferOpt;
  purchaseTimeOpt: PurchaseTimeOpt;
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
  propertyPurpose: PropertyPurposeOpt;
  expectRentPrice: number | undefined;
  propertyTitle: PropertyTitleOpt;
  hasMonthlyPayment: boolean | undefined;
  changeResidence: boolean | undefined;
  payments: Record<string, BaseLoanData>;
}

export interface MortgageAssetsData extends BaseMortgageAssetsData {
  propertyPlan: PropertyPlanOpt;
  sellForPurchaseNew: boolean | undefined;
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
  isOnTheTitle: boolean | undefined;
  isCoBorrower: boolean | undefined;
  relationshipOpt: RelationshipOpt;
  togetherCurrently: boolean | undefined;
  togetherInNewHome: boolean | undefined;
  readyEnter: boolean | undefined;
}

export interface MortgageFinancialSituationData {
  giftFromRelative: number | undefined;
  loanAmount: number | undefined;
  other: number | undefined;
  retirementAccount: number | undefined;
  salesOfRealEstate: number | undefined;
  savingAccount: number | undefined;
  stockAndBonds: number | undefined;
}

export interface MortgageDebtData {
  id: string;
  receiver: string | undefined;
  balance: number | undefined;
  payment: number | undefined;
  paymentSchedule: TimeUnit;
}

export interface MortgageRecordDebtData extends MortgageDebtData {
  canPayoff?: boolean | undefined;
  disabled?: boolean | undefined;
  wrongReason?: DebtWrongReasonOpt | undefined;
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
  homeValue: number | undefined;
}

export interface MonthlyPaymentLoan {
  caption: string | undefined;
  balance: number | undefined;
  payment: number | undefined;
  isPrimary: boolean | undefined;
  includedTaxAndIns: boolean | undefined;
  refinance: boolean | undefined;
  loanType: LoanType;
  loanRate: number | undefined;
}

export interface MRMonthlyPaymentData {
  hasMonthlyPayment: boolean | undefined;
  aboutYourLoans: Record<string, MonthlyPaymentLoan>;
}

export interface MRWhyRefinanceData {
  purpose: WhyRefinanceOpt;
  cashOut: number | undefined;
}

export interface MRYourPropertyData {
  assets: Record<string, BaseMortgageAssetsData>;
}

export interface MRResidenceOwnData {
  ownCurrentEstate: boolean | undefined;
  propertyTitle: PropertyTitleOpt;
  hasMonthlyPayment: boolean | undefined;
  payments: Record<string, BaseLoanData>;
}
