import { AddressData } from '@/types/common';

export enum PipelineTaskItemStatus {
  UNFINISHED = 'unfinished',
  FINISHED = 'finished',
  CONFIRMED = 'confirmed',
}

export enum PipelineTaskName {
  BROKER_LICENSE = 'Broker License',
  ACH_INFORMATION = 'ACH Information',
  BROKER_QUESTIONNAIRE = 'Broker Questionnaire',
  BROKER_AGREEMENT = 'Broker Agreement',
  BROKER_GOVERNMENT_ID = 'Broker Government ID',
  W9_FORM = 'W9 Form',
  LOAN_OFFICER_AGREEMENT = 'Loan Officer information',
  REAL_ESTATE_AGENT_AGREEMENT = 'Real Estate Agent information',
  LOAN_OFFICER_ACH_INFORMATION = 'Loan Officer ACH Information',
  REAL_ESTATE_AGENT_ACH_INFORMATION = 'REAL_ESTATE_AGENT_ACH_INFORMATION',
}

export enum PipelineTaskKey {
  BL = 'BROKER_LICENSE',
  AI = 'ACH_INFORMATION',
  BQ = 'BROKER_QUESTIONNAIRE',
  BA = 'BROKER_AGREEMENT',
  BG = 'BROKER_GOVERNMENT_ID',
  WF = 'W9_FORM',
  LOA = 'LOAN_OFFICER_AGREEMENT',
  REAA = 'REAL_ESTATE_AGENT_AGREEMENT',
  LOI = 'LOAN_OFFICER_ACH_INFORMATION',
  REAI = 'REAL_ESTATE_AGENT_ACH_INFORMATION',
}

export interface PipelineTasksMap {
  [PipelineTaskKey.AI]: PipelineTaskItem<PipelineACH>;
  [PipelineTaskKey.BA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.LOA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.REAA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.BG]: PipelineTaskItem<PipelineGovernment>;
  [PipelineTaskKey.BL]: PipelineTaskItem<PipelineLicense>;
  [PipelineTaskKey.BQ]: PipelineTaskItem<PipelineQuestionnaire>;
  [PipelineTaskKey.WF]: PipelineTaskItem<PipelineW9>;
  [PipelineTaskKey.LOI]: PipelineTaskItem<PipelineACH>;
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
