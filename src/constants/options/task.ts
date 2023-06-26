import {
  DashboardTaskAutomaticPayment,
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskExitStrategy,
  DashboardTaskGender,
  DashboardTaskInstructions,
  DashboardTaskLoanClosing,
  DashboardTaskMaritalStatus,
  //DashboardTaskPrimaryReasonRefinance,
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

export const OPTIONS_TASK_INSTRUCTIONS: Option[] = [
  {
    key: DashboardTaskInstructions.title_officer,
    value: DashboardTaskInstructions.title_officer,
    label: 'Title Officer',
  },
  {
    key: DashboardTaskInstructions.issuing_agent,
    value: DashboardTaskInstructions.issuing_agent,
    label: 'Issuing Agent',
  },
  {
    key: DashboardTaskInstructions.closing_attorney,
    value: DashboardTaskInstructions.closing_attorney,
    label: 'Closing Attorney',
  },
];

export const OPTIONS_TASK_MANAGING_LOAN_CLOSING: Option[] = [
  {
    key: DashboardTaskLoanClosing.escrow_company,
    value: DashboardTaskLoanClosing.escrow_company,
    label: 'Escrow Company',
  },
  {
    key: DashboardTaskLoanClosing.closing_attorney,
    value: DashboardTaskLoanClosing.closing_attorney,
    label: 'Closing Attorney',
  },
];

export const OPTIONS_TASK_AUTOMATIC_PAYMENT: Option[] = [
  {
    key: DashboardTaskAutomaticPayment.plaid,
    value: DashboardTaskAutomaticPayment.plaid,
    label: 'Plaid',
  },
  {
    key: DashboardTaskAutomaticPayment.ach_debit,
    value: DashboardTaskAutomaticPayment.ach_debit,
    label: 'ACH Debit',
  },
];

//export const OPTIONS_TASK_PRIMARY_REASON: Option[] = [
//  {
//    key: DashboardTaskPrimaryReasonRefinance.no_cash_out,
//    value: DashboardTaskPrimaryReasonRefinance.no_cash_out,
//    label: 'Rate & Term refi: no cash out',
//  },
//  {
//    key: DashboardTaskPrimaryReasonRefinance.delayed_purchase_refinance,
//    value: DashboardTaskPrimaryReasonRefinance.delayed_purchase_refinance,
//    label: 'Delayed purchase refinance',
//  },
//  {
//    key: DashboardTaskPrimaryReasonRefinance.currently_rent_out,
//    value: DashboardTaskPrimaryReasonRefinance.currently_rent_out,
//    label: 'Property currently rented out',
//  },
//  {
//    key: DashboardTaskPrimaryReasonRefinance.finish_property_rehab,
//    value: DashboardTaskPrimaryReasonRefinance.finish_property_rehab,
//    label: 'Need more time to finish property rehab',
//  },
//  {
//    key: DashboardTaskPrimaryReasonRefinance.buy_other_property,
//    value: DashboardTaskPrimaryReasonRefinance.buy_other_property,
//    label: 'Use of proceeds to buy other properties',
//  },
//  {
//    key: DashboardTaskPrimaryReasonRefinance.other,
//    value: DashboardTaskPrimaryReasonRefinance.other,
//    label: 'Other',
//  },
//];

export const OPTIONS_TASK_EXIT_STRATEGY: Option[] = [
  {
    key: DashboardTaskExitStrategy.rehab_and_sell,
    value: DashboardTaskExitStrategy.rehab_and_sell,
    label: 'Rehab and Sell',
  },
  {
    key: DashboardTaskExitStrategy.rehab_rent_refinance,
    value: DashboardTaskExitStrategy.rehab_rent_refinance,
    label: 'Rehab and Rental',
  },
  {
    key: DashboardTaskExitStrategy.obtain_long_term_financing,
    value: DashboardTaskExitStrategy.obtain_long_term_financing,
    label: 'Obtain Long Term Financing',
  },
];
