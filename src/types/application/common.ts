import { AddressData } from '@/types';

export interface SelfInfoData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date | string;
  ssn: string;
  propAddr: AddressData;
  authorizedCreditCheck: boolean;
  email: string;
}

export interface SalaryIncomeData {
  timeunit: TimeUnit;
  salary: number;
  overtime: number;
  commission: number;
  bonus: number;
  rsu: number;
  other: number;
}

export interface SelfEmployIncomeData {
  timeunit: TimeUnit;
  shareProfit: number;
  selfPay: number;
}

export interface OtherIncomeData {
  timeunit: TimeUnit;
  socialSecurity: number;
  pension: number;
  disability: number;
  childSupport: number;
  alimony: number;
  other: number;
}

export type IncomeData =
  | SalaryIncomeData
  | SelfEmployIncomeData
  | OtherIncomeData;
