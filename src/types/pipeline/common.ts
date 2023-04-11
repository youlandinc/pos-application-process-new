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
  birthday: string;
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
  documentFile: TaskFiles;
  phone: string;
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
  documentFile: TaskFiles;
  propAddr: AddressData;
  bankName: string;
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
}
