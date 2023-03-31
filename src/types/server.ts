import { LoanStage, LoanType } from '@/types/enum';
import { Options } from '@/types/options';

export enum HttpErrorType {
  tokenExpired = '40001',
}

// Process

export interface ProcessData {
  extra: ProcessExtra;
  owners: Array<{ userId: string }>;
  currentTasks: TaskData[];
  stage: LoanStage;
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
  propertyUsage: Options.OccupancyOpt;
}
