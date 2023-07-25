import {
  PropertyNumberOpt,
  PropertyOpt,
  PropertyUnitOpt,
} from '@/types/options';
import { AddressData } from '@/types/common';
import {
  FixAndFlipCreditScoreState,
  FixAndFlipPurchaseState,
  FixAndFlipRefinanceState,
  StartingState,
} from '@/types/enum';

export interface FixApplicationProcessSnapshot {
  applicationType: ApplicationType;
  productCategory: ProductCategory;
  starting: {
    state: StartingState;
  };
  creditScore: {
    state: FixAndFlipCreditScoreState;
  };
  state: FixAndFlipPurchaseState | FixAndFlipRefinanceState;
}

export interface FixStartingData {
  propertyNumber: PropertyNumberOpt;
  isConfirm: boolean | undefined;
  propertyType: PropertyOpt;
  propertyUnit: PropertyUnitOpt;
  propAddr: AddressData;
}

export interface FixCoBorrowerCondition {
  isCoBorrower: boolean | undefined;
}

export interface FixPurchaseEstimateRateData {
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
}

export interface FixRefinanceEstimateRateData {
  homeValue: number | undefined;
  balance: number | undefined;
  isCashOut: boolean;
  cashOutAmount: number | undefined;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
}
