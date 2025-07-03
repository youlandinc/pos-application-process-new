import {
  AddressData,
  DashboardTaskBorrowerType,
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanMarriedStatusEnum,
} from '@/types';

export interface DBorrowerSignatoryInfo {
  firstName: string;
  lastName: string;
  signatoryTitle: string;
  birthday: string;
  phoneNumber: string;
  email: string;
  citizenship: LoanCitizenshipEnum;
  ssn: string;
  maritalStatus: LoanMarriedStatusEnum;
  isSameMailingAddress: boolean;
  addressInfo: AddressData;
  marriedTogether: LoanAnswerEnum;
}

export interface DBorrowerResponse {
  borrowerType: DashboardTaskBorrowerType;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  addressInfo: AddressData;
  citizenship: LoanCitizenshipEnum;
  ssn: string;
  entityName: string;
  entityType: string;
  entityId: string;
  entityState: string;
  trustName: string;
  signatories: DBorrowerSignatoryInfo[];
}
