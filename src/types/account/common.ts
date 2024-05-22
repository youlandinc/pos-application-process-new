export enum AccountRoleTaskKey {
  licence = 'LICENCE',
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

export type AccountRoleTaskItem = {
  [key in keyof typeof AccountRoleTaskKey]: AccountRoleTaskItemStatus;
};

export interface AccountRoleTaskResponse {
  tasks: AccountRoleTaskItem[];
}
