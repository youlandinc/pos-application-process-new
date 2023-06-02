import {
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskMaritalStatus,
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
