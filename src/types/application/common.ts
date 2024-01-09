import {
  AddressData,
  CommonBorrowerType,
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
} from '@/types';
import { DenialReason } from '@/types/options';

export interface BorrowerData {
  reconciled: boolean;
  preApproved: boolean;
  denialReason: DenialReason;
  debtMonthly: number;
  grossIncomeMonthly: number;
  creditScore: number;
  loanAmountMax: number;
}

export interface SelfInfoData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date | string | null;
  ssn: string;
  propAddr: AddressData;
  authorizedCreditCheck: boolean;
  email: string;
  citizenship: CommonBorrowerType | undefined;
  isSkipCheck: boolean | undefined;
  inputCreditScore: number | undefined;
  borrowerType: DashboardTaskBorrowerType | undefined;
  signatoryTitle: string | undefined;
  entityType: DashboardTaskBorrowerEntityType | undefined;
  stateId: string | undefined | number;
  entityState: string | undefined;
  trustName: string | undefined;
  entityName: string | undefined;
}

export interface SalaryIncomeData {
  timeunit: TimeUnit;
  salary: number | undefined;
  overtime: number | undefined;
  commission: number | undefined;
  bonus: number | undefined;
  rsu: number | undefined;
  other: number | undefined;
}

export interface SelfEmployIncomeData {
  timeunit: TimeUnit;
  shareProfit: number | undefined;
  selfPay: number | undefined;
}

export interface OtherIncomeData {
  timeunit: TimeUnit;
  socialSecurity: number | undefined;
  pension: number | undefined;
  disability: number | undefined;
  childSupport: number | undefined;
  alimony: number | undefined;
  other: number | undefined;
}

export type IncomeData =
  | SalaryIncomeData
  | SelfEmployIncomeData
  | OtherIncomeData;
