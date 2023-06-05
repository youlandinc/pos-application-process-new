import {
  BridgeBehalfTypeOpt,
  BridgeManagingLoanClosingOpt,
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskExitStrategy,
  DashboardTaskGender,
  DashboardTaskMaritalStatus,
  DashboardTaskPrimaryReasonRefinance,
  PaymentTypeOpt,
} from '@/types';

export const OPTIONS_TASK_CITIZENSHIP_STATUS: Option[] = [
  {
    key: DashboardTaskCitizenshipStatus.us_citizen,
    value: DashboardTaskCitizenshipStatus.us_citizen,
    label: 'US Citizen',
  },
  {
    key: DashboardTaskCitizenshipStatus.permanent_resident_alien,
    value: DashboardTaskCitizenshipStatus.permanent_resident_alien,
    label: 'Permanent Resident-Alien',
  },
  {
    key: DashboardTaskCitizenshipStatus.non_permanent_resident_alien,
    value: DashboardTaskCitizenshipStatus.non_permanent_resident_alien,
    label: 'Non-Permanent Resident-Alien',
  },
];
export const OPTIONS_TASK_MARTIAL_STATUS: Option[] = [
  {
    key: DashboardTaskMaritalStatus.married,
    value: DashboardTaskMaritalStatus.married,
    label: 'Unmarried',
  },
  {
    key: DashboardTaskMaritalStatus.unmarried,
    value: DashboardTaskMaritalStatus.unmarried,
    label: 'Married',
  },
  {
    key: DashboardTaskMaritalStatus.separated,
    value: DashboardTaskMaritalStatus.separated,
    label: 'Separated',
  },
];

export const OPTIONS_TASK_BORROWER_TYPE: Option[] = [
  {
    key: DashboardTaskBorrowerType.individual,
    value: DashboardTaskBorrowerType.individual,
    label: 'Individual',
  },
  {
    key: DashboardTaskBorrowerType.entity,
    value: DashboardTaskBorrowerType.entity,
    label: 'Entity',
  },
];

export const OPTIONS_TASK_ENTITY_TYPE: Option[] = [
  {
    key: DashboardTaskBorrowerEntityType.limited_liability_company,
    value: DashboardTaskBorrowerEntityType.limited_liability_company,
    label: 'Limited Liability Company',
  },
  {
    key: DashboardTaskBorrowerEntityType.corporation,
    value: DashboardTaskBorrowerEntityType.corporation,
    label: 'Corporation',
  },
  {
    key: DashboardTaskBorrowerEntityType.limited_partnership,
    value: DashboardTaskBorrowerEntityType.limited_partnership,
    label: 'Limited Partnership',
  },
  {
    key: DashboardTaskBorrowerEntityType.limited_company,
    value: DashboardTaskBorrowerEntityType.limited_company,
    label: 'Limited Company',
  },
  {
    key: DashboardTaskBorrowerEntityType.individual,
    value: DashboardTaskBorrowerEntityType.individual,
    label: 'Individual',
  },
];

export const OPTIONS_TASK_GENDER: Option[] = [
  {
    key: DashboardTaskGender.male,
    value: DashboardTaskGender.male,
    label: 'Male',
  },
  {
    key: DashboardTaskGender.female,
    value: DashboardTaskGender.female,
    label: 'Female',
  },
  {
    key: DashboardTaskGender.not_provide,
    value: DashboardTaskGender.not_provide,
    label: 'I do not wish to provide this information',
  },
];

export const OPTIONS_TASK_BEHALF_TYPE: Option[] = [
  {
    key: BridgeBehalfTypeOpt.TitleOfficer,
    value: BridgeBehalfTypeOpt.TitleOfficer,
    label: 'Title Officer',
  },
  {
    key: BridgeBehalfTypeOpt.IssuingAgent,
    value: BridgeBehalfTypeOpt.IssuingAgent,
    label: 'Issuing Agent',
  },
  {
    key: BridgeBehalfTypeOpt.ClosingAttorney,
    value: BridgeBehalfTypeOpt.ClosingAttorney,
    label: 'Closing Attorney',
  },
];

export const OPTIONS_TASK_MANAGING_LOAN_CLOSING: Option[] = [
  {
    key: BridgeManagingLoanClosingOpt.EscrowCompany,
    value: BridgeManagingLoanClosingOpt.EscrowCompany,
    label: 'Escrow Company',
  },
  {
    key: BridgeManagingLoanClosingOpt.ClosingAttorney,
    value: BridgeManagingLoanClosingOpt.ClosingAttorney,
    label: 'Closing Attorney',
  },
];

export const OPTIONS_TASK_PAYMENT_TYPE: Option[] = [
  {
    key: PaymentTypeOpt.Plaid,
    value: PaymentTypeOpt.Plaid,
    label: 'Plaid',
  },
  {
    key: PaymentTypeOpt.ACHDebit,
    value: PaymentTypeOpt.ACHDebit,
    label: 'ACH Debit',
  },
];

export const OPTIONS_TASK_PRIMARY_REASON: Option[] = [
  {
    key: DashboardTaskPrimaryReasonRefinance.no_cash_out,
    value: DashboardTaskPrimaryReasonRefinance.no_cash_out,
    label: 'Rate & Term refi: no cash out',
  },
  {
    key: DashboardTaskPrimaryReasonRefinance.delayed_purchase_refinance,
    value: DashboardTaskPrimaryReasonRefinance.delayed_purchase_refinance,
    label: 'Delayed purchase refinance',
  },
  {
    key: DashboardTaskPrimaryReasonRefinance.currently_rent_out,
    value: DashboardTaskPrimaryReasonRefinance.currently_rent_out,
    label: 'Property currently rented out',
  },
  {
    key: DashboardTaskPrimaryReasonRefinance.finish_property_rehab,
    value: DashboardTaskPrimaryReasonRefinance.finish_property_rehab,
    label: 'Need more time to finish property rehab',
  },
  {
    key: DashboardTaskPrimaryReasonRefinance.buy_other_property,
    value: DashboardTaskPrimaryReasonRefinance.buy_other_property,
    label: 'Use of proceeds to buy other properties',
  },
  {
    key: DashboardTaskPrimaryReasonRefinance.other,
    value: DashboardTaskPrimaryReasonRefinance.other,
    label: 'Other',
  },
];

export const OPTIONS_TASK_EXIT_STRATEGY: Option[] = [
  {
    key: DashboardTaskExitStrategy.rehab_and_sell,
    value: DashboardTaskExitStrategy.rehab_and_sell,
    label: 'Need more time to finish property rehab',
  },
  {
    key: DashboardTaskExitStrategy.rehab_rent_refinance,
    value: DashboardTaskExitStrategy.rehab_rent_refinance,
    label: 'Use of proceeds to buy other properties',
  },
  {
    key: DashboardTaskExitStrategy.other,
    value: DashboardTaskExitStrategy.other,
    label: 'Other',
  },
];
