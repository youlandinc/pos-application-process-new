import {
  BridgePropertyNumberOpt,
  ChannelOpt,
  PropertyOpt,
  PropertyUnitOpt,
} from '@/types/options';
import { AddressData } from '@/types/common';
import {
  BridgeCreditScoreState,
  BridgePurchaseState,
  BridgeRefinanceState,
  StartingState,
} from '@/types/enum';

export interface BridgeApplicationProcessSnapshot {
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

export interface BridgeStartingData {
  propertyNumber: BridgePropertyNumberOpt;
  isConfirm: boolean | undefined;
  propertyType: PropertyOpt;
  propertyUnit: PropertyUnitOpt;
  propAddr: AddressData;
}

export interface WhereKnowUsData {
  reference: ChannelOpt;
}

export interface BridgeCoBorrowerCondition {
  isCoBorrower: boolean | undefined;
}

export interface BridgePurchaseEstimateRateData {
  purchasePrice: number | undefined;
  purchaseLoanAmount: number | undefined;
  isCor: boolean | undefined;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
}

export interface BridgeRefinanceEstimateRateData {
  homeValue: number | undefined;
  balance: number | undefined;
  isCashOut: boolean;
  cashOutAmount: number | undefined;
  isCor: boolean;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
}
