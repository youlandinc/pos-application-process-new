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

export enum DashboardTaskBorrowerEntityType {
  default = '',
  limited_liability_company = 'LIMITED_LIABILITY_COMPANY',
  corporation = 'CORPORATION',
  limited_partnership = 'LIMITED_PARTNERSHIP',
  limited_company = 'LIMITED_COMPANY',
  individual = 'INDIVIDUAL',
}

export enum DashboardTaskGender {
  default = '',
  male = 'MAN',
  female = 'WOMAN',
  not_provide = 'NOT_PROVIDE',
}

export enum DashboardTaskLoanClosing {
  escrow_company = 'ESCROW_COMPANY',
  closing_attorney = 'CLOSING_ATTORNEY',
}

export enum DashboardTaskInstructions {
  title_officer = 'TITLE_OFFICER',
  issuing_agent = 'ISSUING_AGENT',
  closing_attorney = 'CLOSING_ATTORNEY',
}

// appraisal
export enum AppraisalTaskPaymentStatus {
  undone = 'CREATED',
  processing = 'PROCESSING',
  complete = 'SUCCEEDED',
  fail = 'FAILED',
}
