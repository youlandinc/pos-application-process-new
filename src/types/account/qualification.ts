export enum AccountRoleTaskKey {
  license = 'LICENSE',
  agreement = 'AGREEMENT',
  government_id = 'GOVERNMENT_ID',
  w9 = 'W9',
  questionnaire = 'QUESTIONNAIRE',
  ach = 'ACH',
}

export enum AccountRoleTaskFormStatus {
  active = 'ACTIVE',
  suspended = 'SUSPENDED',
  pending_info = 'PENDING_INFO',
  ready_for_review = 'READY_FOR_REVIEW',
}

export enum AccountRoleTaskItemStatus {
  unfinished = 'UNFINISHED',
  finished = 'FINISHED',
  confirmed = 'CONFIRMED',
}

export interface AccountRoleTaskHash {
  [AccountRoleTaskKey.agreement]: AccountRoleTaskItemStatus;
  [AccountRoleTaskKey.w9]: AccountRoleTaskItemStatus;
  [AccountRoleTaskKey.ach]: AccountRoleTaskItemStatus;

  [AccountRoleTaskKey.license]?: AccountRoleTaskItemStatus;
  [AccountRoleTaskKey.questionnaire]?: AccountRoleTaskItemStatus;
  [AccountRoleTaskKey.government_id]?: AccountRoleTaskItemStatus;
}

export interface AccountRoleTaskResponse {
  tasks: AccountRoleTaskHash;
}

export enum QualificationACHAccountType {
  checking = 'CHECKING',
  savings = 'SAVINGS',
  default = '',
}

export enum QualificationQuestionnaireLicenseType {
  default = '',
  nmls = 'NMLS',
  dre_broker = 'DRE_BROKER',
  dre_salesperson = 'DRE_SALE_PERSON',
}

export interface QuestionnairePerson {
  firstName: string;
  lastName: string;
  ssn: string;
  birthday: null | Date | string;
  state: string;
  licenseType: QualificationQuestionnaireLicenseType;
  license: string;
}
