import { Options } from '@/types/options';
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
  propertyNumber: Options.BridgePropertyNumberOpt;
  isConfirm: boolean | undefined;
  propertyType: Options.PropertyOpt;
  propertyUnit: Options.PropertyUnitOpt;
  propAddr: AddressData;
}

export interface WhereKnowUsData {
  reference: Options.ChannelOpt;
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
