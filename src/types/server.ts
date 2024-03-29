import { LoanStage, LoanType } from '@/types/enum';
import { OccupancyOpt } from '@/types/options';
import { TaskFiles } from '@/types/pipeline';

export enum HttpErrorType {
  tokenExpired = '40001',
}

export enum HttpVariantType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

export interface HttpError {
  message: string;
  header: string;
  variant: HttpVariantType;
}

// Process
export interface ProcessData {
  extra: ProcessExtra;
  owners: Array<{ userId: string }>;
  currentTasks: TaskData[];
  stage: LoanStage;
  modifyVariables: any;
}

// PreApprovalLetter
export interface PreApprovalLetterData {
  name: string;
  expiredDate: string;
  loanAmount: number;
  loanType: LoanType;
  approvedDate: string;
  downPayment: number;
  purchasePrice: number;
  city: string;
  state: string;
  propertyUsage: OccupancyOpt;
}

// documents response
export interface DocumentUploadResponse {
  totalNum: number;
  uploadedNum: number;
  documents: {
    id: number;
    categoryDocs: {
      fileKey: string;
      fileName: string;
      files: TaskFiles[];
      id: number;
      templateName: string;
      templateUrl: string;
    }[];
    collapse: boolean;
    categoryKey: string;
    categoryName: string;
  }[];
}
