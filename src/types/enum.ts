export enum LoanSpecies {
  Mortgage = 'Mortgage',
  Bridge = 'Bridge',
  FixAndFlip = 'FixAndFlip',
  GroundUpConstruction = 'GroundUpConstruction',
}

export enum BizType {
  login = 'LOGIN',
  register = 'REGISTER',
  reset_pass = 'RESET_PASS',
  change_pass = 'CHANGE_PASS',
  change_email = 'CHANGE_EMAIL',
}

export enum LoginType {
  YLACCOUNT_LOGIN = 'YLACCOUNT_LOGIN',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  DEFAULT = '',
}

export enum IntendedUseEnum {
  single_family = 'SINGLE_FAMILY',
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

export enum FeeUnitEnum {
  dollar = 'DOLLAR',
  percent = 'PERCENT',
}

export enum LandTypeEnum {
  raw_land = 'RAW_LAND',
  some_utilities = 'SOME_UTILITIES',
  all_utilities = 'ALL_UTILITIES',
}

export enum LinkFromOutEnum {
  upload_file = 'upload',
  file_comment = 'comment',
}

export enum SurveySourceEnum {
  email = 'EMAIL',
  google_search = 'GOOGLE_SEARCH',
  call = 'CALL',
  social_media = 'SOCIAL_MEDIA',
  flyer = 'FLYER',
  referral = 'REFERRAL',
  event = 'EVENT',
  other = 'OTHER',
}
