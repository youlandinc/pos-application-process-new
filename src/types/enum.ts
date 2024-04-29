export enum LoanStage {
  Application = 'Application',
  PreApproved = 'Pre-approved',
  RateLocking = 'Rate locking',
  RateLocked = 'Rate locked',
  Approved = 'Approved',
  DocsOut = 'Docs out',
  Funded = 'Funded',
  FinalClosing = 'Final closing',
  Refusal = 'Rejected',
}

export enum AppraisalStage {
  NotStarted = 'NOT_STARTED',
  PaidFor = 'PAID_FOR',
  Ordered = 'ORDERED',
  Scheduled = 'SCHEDULED',
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
}

export enum LoanSpecies {
  Mortgage = 'Mortgage',
  Bridge = 'Bridge',
  FixAndFlip = 'FixAndFlip',
  GroundUpConstruction = 'GroundUpConstruction',
}

export enum BizType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASS = 'RESET_PASS',
  CHANGE_PASS = 'CHANGE_PASS',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
}

export enum LoginType {
  YLACCOUNT_LOGIN = 'YLACCOUNT_LOGIN',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  DEFAULT = '',
}

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  BROKER = 'BROKER',
  REAL_ESTATE_AGENT = 'REAL_ESTATE_AGENT',
  LOAN_OFFICER = 'LOAN_OFFICER',
  LENDER = 'LENDER',
}

export enum ServiceTypeEnum {
  WHITE_LABEL = 'WHITE_LABEL',
  SAAS = 'SAAS',
}

export enum SoftCreditRequirementEnum {
  required = 'REQUIRED',
  optional = 'OPTIONAL',
}

export enum FreeTrialState {
  None = 'None',
  Activated = 'Activated',
  Expired = 'Expired',
}

export enum DomainState {
  CONNECTED = 'CONNECTED',
  WAITING_VERIFICATION = 'WAITING_VERIFICATION',
  NOT_LINKED = 'NOT_LINKED',
}

export enum DomainSource {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export enum FeeUnitEnum {
  dollar = 'DOLLAR',
  percent = 'PERCENT',
}
