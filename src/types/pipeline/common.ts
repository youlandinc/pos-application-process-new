import { AddressData } from '@/types/common';

export enum PipelineTaskItemStatus {
  UNFINISHED = 'unfinished',
  FINISHED = 'finished',
  CONFIRMED = 'confirmed',
}

export enum PipelineTaskName {
  // common
  W9_FORM = 'W9 Form',
  ACH_INFORMATION = 'ACH Information',
  // broker
  BROKER_LICENSE = 'Broker License',
  BROKER_QUESTIONNAIRE = 'Broker Questionnaire',
  BROKER_AGREEMENT = 'Broker Agreement',
  BROKER_GOVERNMENT_ID = 'Broker Government ID',
  // lender
  LENDER_LICENSE = 'Lender License',
  LENDER_QUESTIONNAIRE = 'Lender Questionnaire',
  LENDER_AGREEMENT = 'Lender Agreement',
  LENDER_GOVERNMENT_ID = 'Lender Government ID',
  // loan officer
  LOAN_OFFICER_AGREEMENT = 'Loan Officer information',
  LOAN_OFFICER_ACH_INFORMATION = 'Loan Officer ACH Information',
  // real estate agent
  REAL_ESTATE_AGENT_AGREEMENT = 'Real Estate Agent information',
  REAL_ESTATE_AGENT_ACH_INFORMATION = 'Real Estate Agent ACH Information',
}

export enum PipelineTaskKey {
  // common
  WF = 'W9_FORM',
  AI = 'ACH_INFORMATION',
  // broker
  BL = 'BROKER_LICENSE',
  BQ = 'BROKER_QUESTIONNAIRE',
  BA = 'BROKER_AGREEMENT',
  BG = 'BROKER_GOVERNMENT_ID',
  // lender
  LL = 'LENDER_LICENSE',
  LQ = 'LENDER_QUESTIONNAIRE',
  LA = 'LENDER_AGREEMENT',
  LG = 'LENDER_GOVERNMENT_ID',
  // loan officer
  LOA = 'LOAN_OFFICER_AGREEMENT',
  LOI = 'LOAN_OFFICER_ACH_INFORMATION',
  // real estate agent
  REAA = 'REAL_ESTATE_AGENT_AGREEMENT',
  REAI = 'REAL_ESTATE_AGENT_ACH_INFORMATION',
}

export interface PipelineTasksMap {
  // common
  [PipelineTaskKey.AI]: PipelineTaskItem<PipelineACH>;
  [PipelineTaskKey.WF]: PipelineTaskItem<PipelineW9>;
  // broker
  [PipelineTaskKey.BL]: PipelineTaskItem<PipelineLicense>;
  [PipelineTaskKey.BQ]: PipelineTaskItem<PipelineQuestionnaire>;
  [PipelineTaskKey.BA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.BG]: PipelineTaskItem<PipelineGovernment>;
  // lender
  [PipelineTaskKey.LL]: PipelineTaskItem<PipelineLicense>;
  [PipelineTaskKey.LQ]: PipelineTaskItem<PipelineQuestionnaire>;
  [PipelineTaskKey.LA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.LG]: PipelineTaskItem<PipelineGovernment>;
  // loan officer
  [PipelineTaskKey.LOI]: PipelineTaskItem<PipelineACH>;
  [PipelineTaskKey.LOA]: PipelineTaskItem<PipelineAgreement>;
  // real estate agent
  [PipelineTaskKey.REAA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.REAI]: PipelineTaskItem<PipelineACH>;
}

export interface PipelineTaskItem<
  T extends
    | PipelineACH
    | PipelineAgreement
    | PipelineGovernment
    | PipelineLicense
    | PipelineQuestionnaire
    | PipelineW9,
> {
  taskId: string;
  taskName: PipelineTaskName;
  taskStatus: PipelineTaskItemStatus;
  taskForm: T | null;
}

export interface TaskFiles {
  originalFileName: string;
  fileName: string;
  url: string;
  uploadTime: string;
}

export interface PipelineQuestionnaireOwner {
  ownerName: string;
  ssn: string;
  birthday: string | Date;
  state: string;
  licenseType: string;
  license: string;
}

export interface PipelineLicense {
  taskFiles: TaskFiles[];
}

export interface PipelineAgreement {
  propAddr: AddressData;
  email: string;
  title: string;
  fullName: string;
  company: string;
  documentFile?: TaskFiles;
  phoneNumber: string;
  license?: PipelineLicenseType;
}

export interface PipelineGovernment {
  taskFiles: TaskFiles[];
}

export interface PipelineW9 {
  taskFiles: TaskFiles[];
}

export interface PipelineQuestionnaire {
  documentFile: TaskFiles;
  licenses: PipelineQuestionnaireOwner[];
}

export interface PipelineACH {
  documentFile?: TaskFiles;
  address: AddressData;
  bankName: string;
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: PipelineACHAccountType;
}

export enum PipelineLicenseType {
  NMLS_LICENSE = 'NMLS',
  DRE_LICENSE = 'DRE',
  DEFAULT = '',
}

export enum PipelineACHAccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  DEFAULT = '',
}

export enum PipelineAccountStatus {
  active = 'ACTIVE',
  suspended = 'SUSPENDED',
  pending_info = 'PENDING_INFO',
  ready_for_review = 'READY_FOR_REVIEW',
}
