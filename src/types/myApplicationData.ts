import {
  PipelineTaskItemStatus,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/enum'
import { AddressData } from '@/types/variable'

export interface PipelineTasksMap {
  [PipelineTaskKey.AI]: PipelineTaskItem<PipelineACH>;
  [PipelineTaskKey.BA]: PipelineTaskItem<PipelineAgreement>;
  [PipelineTaskKey.BG]: PipelineTaskItem<PipelineGovernment>;
  [PipelineTaskKey.BL]: PipelineTaskItem<PipelineLicense>;
  [PipelineTaskKey.BQ]: PipelineTaskItem<PipelineQuestionnaire>;
  [PipelineTaskKey.WF]: PipelineTaskItem<PipelineW9>;
}

export interface PipelineTaskItem<T extends PipelineACH | PipelineAgreement | PipelineGovernment | PipelineLicense | PipelineQuestionnaire | PipelineW9> {
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
