import { FeeUnitEnum, IntendedUseEnum, LoanAnswerEnum } from '@/types';

export enum LoanSnapshotEnum {
  starting_question = 'STARTING_QUESTION',
  estimate_rate = 'ESTIMATE_RATE',
  auth_page = 'AUTH_PAGE',
  loan_address = 'LOAN_ADDRESS',
  background_information = 'BACKGROUND_INFORMATION',
  loan_summary = 'LOAN_SUMMARY',
  loan_overview = 'LOAN_OVERVIEW',
  // customer after background information
  select_executive = 'SELECT_EXECUTIVE',
  // broker after background information
  compensation_page = 'COMPENSATION_PAGE',
  // multifamily
  enter_loan_info = 'ENTER_LOAN_INFO',
  // commercial
  contact_info = 'CONTACT_INFO',
  thank_you_page = 'THANK_YOU_PAGE',
  // land
  land_readiness = 'LAND_READINESS',
}

export interface AdditionalFee {
  id?: string;
  fieldName: string;
  unit: FeeUnitEnum;
  value: number | undefined;
}

export interface SelectExecutiveFormData {
  executiveId: string;
  executiveName: string;
}

export interface LandReadinessFormData {
  intendedUse: IntendedUseEnum;
  hasObtained: LoanAnswerEnum;
  hasCompleted: LoanAnswerEnum;
  hasTimeline: LoanAnswerEnum;
}

export interface CompensationInformationFromData
  extends SelectExecutiveFormData {
  originationPoints: number;
  processingFee: number;
  isAdditional: boolean;
  additionalInfo: string;
  additionalFees: AdditionalFee[];
}

export interface BackgroundInformationFormData {
  hadBankruptcy: LoanAnswerEnum;
  hadDelinquent: LoanAnswerEnum;
  hadForeclosure: LoanAnswerEnum;
  hadFelony: LoanAnswerEnum;
  hadLitigation: LoanAnswerEnum;
}

export enum PrepaymentPenaltyEnum {
  no_ppp = 'NO_PPP',
  one_year = 'ONE_YEAR_TERM',
  three_year = 'THREE_YEAR_TERM',
  five_year = 'FIVE_YEAR_TERM',
  seven_year = 'SEVEN_YEAR_TERM',
}
