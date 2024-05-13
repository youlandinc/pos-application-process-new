import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskInstructions,
  DashboardTaskLoanClosing,
} from '@/types';

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
  {
    key: DashboardTaskBorrowerType.trust,
    value: DashboardTaskBorrowerType.trust,
    label: 'Trust',
  },
];

export const OPTIONS_TASK_ENTITY_TYPE: Option[] = [
  {
    key: DashboardTaskBorrowerEntityType.limited_liability_company,
    value: DashboardTaskBorrowerEntityType.limited_liability_company,
    label: 'Limited liability company',
  },
  {
    key: DashboardTaskBorrowerEntityType.corporation,
    value: DashboardTaskBorrowerEntityType.corporation,
    label: 'Corporation',
  },
  {
    key: DashboardTaskBorrowerEntityType.limited_partnership,
    value: DashboardTaskBorrowerEntityType.limited_partnership,
    label: 'Limited partnership',
  },
  {
    key: DashboardTaskBorrowerEntityType.limited_company,
    value: DashboardTaskBorrowerEntityType.limited_company,
    label: 'Limited company',
  },
  {
    key: DashboardTaskBorrowerEntityType.individual,
    value: DashboardTaskBorrowerEntityType.individual,
    label: 'Individual',
  },
];

export const OPTIONS_TASK_INSTRUCTIONS: Option[] = [
  {
    key: DashboardTaskInstructions.title_officer,
    value: DashboardTaskInstructions.title_officer,
    label: 'Title officer',
  },
  {
    key: DashboardTaskInstructions.issuing_agent,
    value: DashboardTaskInstructions.issuing_agent,
    label: 'Issuing agent',
  },
  {
    key: DashboardTaskInstructions.closing_attorney,
    value: DashboardTaskInstructions.closing_attorney,
    label: 'Closing attorney',
  },
];

export const OPTIONS_TASK_MANAGING_LOAN_CLOSING: Option[] = [
  {
    key: DashboardTaskLoanClosing.escrow_company,
    value: DashboardTaskLoanClosing.escrow_company,
    label: 'Escrow company',
  },
  {
    key: DashboardTaskLoanClosing.closing_attorney,
    value: DashboardTaskLoanClosing.closing_attorney,
    label: 'Closing attorney',
  },
];
