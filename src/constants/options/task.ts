import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskGender,
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
