// tasks
export enum DashboardTaskCitizenshipStatus {
  default = '',
  us_citizen = 'US_CITIZEN',
  permanent_resident_alien = 'PERMANENT_RESIDENT_ALIEN',
  foreign_national = 'FOREIGN_NATIONAL',
  non_permanent_resident_alien = 'NON_PERMANENT_RESIDENT_ALIEN',
}

export enum DashboardTaskBorrowerType {
  default = '',
  individual = 'INDIVIDUAL',
  entity = 'ENTITY',
  trust = 'TRUST',
}

export enum DashboardTaskGender {
  default = '',
  male = 'MAN',
  female = 'WOMAN',
  not_provide = 'NOT_PROVIDE',
}

export enum DashboardTaskInstructions {
  title_officer = 'TITLE_OFFICER',
  issuing_agent = 'ISSUING_AGENT',
  closing_attorney = 'CLOSING_ATTORNEY',
}

// not use

export enum DashboardTaskBorrowerEntityType {
  default = '',
  limited_liability_company = 'LIMITED_LIABILITY_COMPANY',
  corporation = 'CORPORATION',
  limited_partnership = 'LIMITED_PARTNERSHIP',
  limited_company = 'LIMITED_COMPANY',
  individual = 'INDIVIDUAL',
}

export enum DashboardTaskMaritalStatus {
  unmarried = 'UNMARRIED',
  married = 'MARRIED',
  separated = 'SEPARATED',
}

export enum DashboardTaskPrimaryReasonRefinance {
  no_cash_out = 'NO_CASH_OUT',
  delayed_purchase_refinance = 'DELAYED_PURCHASE_REFINANCE',
  currently_rent_out = 'CURRENTLY_RENT_OUT',
  finish_property_rehab = 'FINISH_PROPERTY_REHAB',
  buy_other_property = 'BUY_OTHER_PROPERTY',
  other = 'OTHER',
}

export enum DashboardTaskExitStrategy {
  rehab_and_sell = 'REHAB_AND_SELL',
  rehab_rent_refinance = 'REHAB_RENT_REFINANCE',
  obtain_long_term_financing = 'OBTAIN_LONG_TERM_FINANCING',
}

export enum DashboardTaskLoanClosing {
  escrow_company = 'ESCROW_COMPANY',
  closing_attorney = 'CLOSING_ATTORNEY',
}

export enum DashboardTaskAutomaticPayment {
  plaid = 'PLAID',
  ach_debit = 'ACH_DEBIT',
}

export enum DashboardTaskPaymentTableStatus {
  notice = 'NOTICE',
  summary = 'SUMMARY',
  payment = 'PAYMENT',
}

export enum DashboardTaskPaymentMethodsStatus {
  undone = 'created',
  processing = 'processing',
  complete = 'succeeded',
  fail = 'failed',
}

export interface CustomRateData {
  customRate?: boolean | undefined;
  interestRate?: number | undefined;
  loanTerm?: number | undefined;
}
