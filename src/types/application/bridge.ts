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

export interface BridgePurchaseEstimateRateData {
  purchasePrice: number | undefined;
  purchaseLoanAmount: number | undefined;
  isCor: boolean | undefined;
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
  lenderPoints?: number | undefined;
  lenderProcessingFee?: number | undefined;
  officerPoints?: number | undefined;
  officerProcessingFee?: number | undefined;
  agentFee?: number | undefined;
}

interface TaskInfo {
  taskId: string;
  taskName: string;
  taskForm: null;
  finished: boolean;
}

export interface BridgePurchaseTasks {
  BP_APPLICATION_LOAN: TaskInfo;
  BP_APPRAISAL_PROPERTY_DETAILS: TaskInfo;
  BP_BORROWER_GUARANTOR: TaskInfo;
  BP_BORROWER_PERSONAL: TaskInfo;
  BP_APPRAISAL_COST: TaskInfo;
  BP_BORROWER_DEMOGRAPHICS: TaskInfo;
  BP_BORROWER_CO_BORROWER: TaskInfo;
  BP_APPLICATION_PROPERTY: TaskInfo;
  BP_AUTOPAY_ACH: TaskInfo;
  BP_THIRD_CLOSING: TaskInfo;
  BP_THIRD_INSURANCE: TaskInfo;
  BP_DOCUMENTS_DOCUMENTS: TaskInfo;
  BP_DOCUMENTS_CONTRACT: TaskInfo;
  BP_DOCUMENTS_REVIEW: TaskInfo;
  BP_DOCUMENTS_PICTURES: TaskInfo;
  BP_APPLICATION_INVESTMENT: TaskInfo;
}

export interface BridgeRefinanceTasks {
  BR_APPLICATION_LOAN: TaskInfo;
  BR_APPRAISAL_PROPERTY_DETAILS: TaskInfo;
  BR_BORROWER_GUARANTOR: TaskInfo;
  BR_BORROWER_PERSONAL: TaskInfo;
  BR_APPRAISAL_COST: TaskInfo;
  BR_BORROWER_DEMOGRAPHICS: TaskInfo;
  BR_BORROWER_CO_BORROWER: TaskInfo;
  BR_APPLICATION_PROPERTY: TaskInfo;
  BR_AUTOPAY_ACH: TaskInfo;
  BR_THIRD_CLOSING: TaskInfo;
  BR_THIRD_INSURANCE: TaskInfo;
  BR_DOCUMENTS_DOCUMENTS: TaskInfo;
  BR_DOCUMENTS_CONTRACT: TaskInfo;
  BR_DOCUMENTS_REVIEW: TaskInfo;
  BR_DOCUMENTS_PICTURES: TaskInfo;
  BR_APPLICATION_INVESTMENT: TaskInfo;
}

export interface LoanTask {
  processId: string;
  stage: string;
  tasks: BridgePurchaseTasks & BridgeRefinanceTasks;
}
