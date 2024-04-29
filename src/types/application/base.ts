import { LoanAnswerEnum } from '@/types';

export enum LoanSnapshotEnum {
  starting_question = 'STARTING_QUESTION',
  estimate_rate = 'ESTIMATE_RATE',
  auth_page = 'AUTH_PAGE',
  loan_address = 'LOAN_ADDRESS',
  background_information = 'BACKGROUND_INFORMATION',
  compensation_page = 'COMPENSATION_PAGE',
  loan_summary = 'LOAN_SUMMARY',
  loan_overview = 'LOAN_OVERVIEW',
}

export interface FormNodeItem {
  nextStep?: () => void;
  prevStep?: () => void;
}

export interface CompensationInformationFromData {
  originationPoints: number;
  processingFee: number;
  isAdditional: boolean;
  additionalInfo: string;
}

export interface BackgroundInformationFormData {
  hadBankruptcy: LoanAnswerEnum;
  hadDelinquent: LoanAnswerEnum;
  hadForeclosure: LoanAnswerEnum;
  hadFelony: LoanAnswerEnum;
  hadLitigation: LoanAnswerEnum;
}
