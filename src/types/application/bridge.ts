import { DashboardTaskInfo } from '@/types';
import {
  ChannelOpt,
  PropertyNumberOpt,
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
  propertyNumber: PropertyNumberOpt;
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
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
  closeDate?: string | null | undefined | Date;
}

export interface BREstimateRateData {
  homeValue: number | undefined;
  balance: number | undefined;
  isCashOut: boolean;
  cashOutAmount: number | undefined;
  brokerPoints?: number | undefined;
  brokerProcessingFee?: number | undefined;
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
  closeDate?: string | null | undefined | Date;
}

export type BPDashboardTaskKey =
  | 'BP_APPLICATION_LOAN'
  | 'BP_APPLICATION_PROPERTY'
  | 'BP_APPLICATION_INVESTMENT'
  | 'BP_BORROWER_PERSONAL'
  | 'BP_BORROWER_DEMOGRAPHICS'
  | 'BP_BORROWER_CO_BORROWER'
  | 'BP_BORROWER_GUARANTOR'
  | 'BP_APPRAISAL_PROPERTY_DETAILS'
  | 'BP_THIRD_CLOSING'
  | 'BP_THIRD_INSURANCE'
  | 'BP_DOCUMENTS_CONTRACT'
  | 'BP_DOCUMENTS_PICTURES'
  | 'BP_DOCUMENTS_REVIEW'
  | 'BP_DOCUMENTS_DOCUMENTS'
  | 'BP_APPRAISAL_COST';

export type BRDashboardTaskKey =
  | 'BR_APPLICATION_LOAN'
  | 'BR_APPLICATION_PROPERTY'
  | 'BR_APPLICATION_INVESTMENT'
  | 'BR_BORROWER_PERSONAL'
  | 'BR_BORROWER_DEMOGRAPHICS'
  | 'BR_BORROWER_CO_BORROWER'
  | 'BR_BORROWER_GUARANTOR'
  | 'BR_APPRAISAL_PROPERTY_DETAILS'
  | 'BR_THIRD_CLOSING'
  | 'BR_THIRD_INSURANCE'
  | 'BR_DOCUMENTS_CONTRACT'
  | 'BR_DOCUMENTS_PICTURES'
  | 'BR_DOCUMENTS_REVIEW'
  | 'BR_DOCUMENTS_DOCUMENTS'
  | 'BR_APPRAISAL_COST';

export type BridgeDashboardTaskMap<
  T extends BPDashboardTaskKey | BRDashboardTaskKey,
> = Record<T, DashboardTaskInfo>;

export interface BridgeDashboardLoanTask {
  processId: string;
  stage: string;
  tasks: BridgeDashboardTaskMap<BPDashboardTaskKey & BRDashboardTaskKey>;
  totalNum: number;
  finishedNum: number;
}
