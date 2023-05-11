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

export interface BPEstimateRateData {
  purchasePrice: number | undefined;
  purchaseLoanAmount: number | undefined;
  isCor: boolean | undefined;
  cor: number | undefined;
  arv: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
}

// export interface BREstimateRateData {
//   homeValue: number | undefined;
//   balance: number | undefined;
//   isCashOut: boolean | undefined;
//   cashOutAmount: number | undefined;
//   isCor: boolean | undefined;
//   cor: number | undefined;
//   arv: number | undefined;
//   brokerPoints?: number | undefined;
//   brokerProcessingFee?: number | undefined;
// }
export interface BREstimateRateData {
  homeValue?: number;
  balance?: number;
  isCashOut?: boolean;
  cashOutAmount?: number;
  isCor?: boolean;
  cor?: number;
  arv?: number;
  brokerPoints?: number;
  brokerProcessingFee?: number;
}
