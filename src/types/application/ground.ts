import {
  PropertyNumberOpt,
  PropertyOpt,
  PropertyUnitOpt,
} from '@/types/options';
import { AddressData } from '@/types/common';
import {
  GroundUpConstructionCreditScoreState,
  GroundUpConstructionPurchaseState,
  GroundUpConstructionRefinanceState,
  StartingState,
} from '@/types/enum';

export interface GroundApplicationProcessSnapshot {
  applicationType: ApplicationType;
  productCategory: ProductCategory;
  starting: {
    state: StartingState;
  };
  creditScore: {
    state: GroundUpConstructionCreditScoreState;
  };
  state: GroundUpConstructionPurchaseState | GroundUpConstructionRefinanceState;
}

export interface GroundStartingData {
  propertyNumber: PropertyNumberOpt;
  isConfirm: boolean | undefined;
  propertyType: PropertyOpt;
  propertyUnit: PropertyUnitOpt;
  propAddr: AddressData;
}

export interface GroundCoBorrowerCondition {
  isCoBorrower: boolean | undefined;
}

export interface GPEstimateRateData {
  purchasePrice: number | undefined;
  purchaseLoanAmount: number | undefined;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
  closeDate?: string | undefined | Date | null;
  customRate?: boolean | undefined;
  interestRate?: number | undefined;
  loanTerm?: number | undefined;
}

export interface GREstimateRateData {
  homeValue?: number | undefined;
  balance?: number | undefined;
  isCashOut: boolean;
  cashOutAmount?: number | undefined;
  cor?: number | undefined;
  arv?: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
  closeDate?: string | undefined | Date | null;
  customRate?: boolean | undefined;
  interestRate?: number | undefined;
  loanTerm?: number | undefined;
}
