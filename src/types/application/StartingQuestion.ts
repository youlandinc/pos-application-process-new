export enum LoanTypeEnum {
  mortgage = 'MORTGAGE',
  bridge = 'BRIDGE',
}

export enum LoanProductCategoryEnum {
  default = '',
  stabilized_bridge = 'STABILIZED_BRIDGE',
  fix_and_flip = 'FIX_AND_FLIP',
  ground_up_construction = 'GROUND_UP_CONSTRUCTION',
}

export enum LoanPurposeEnum {
  default = '',
  purchase = 'PURCHASE',
  refinance = 'REFINANCE',
}

export enum LoanPropertyTypeEnum {
  default = '',
  single_family = 'SINGLE_FAMILY',
  townhouse = 'TOWNHOUSE',
  condo = 'CONDO',
  two_to_four_family = 'UNITS24',
}

export enum LoanPropertyUnitEnum {
  default = '',
  two_units = 'TWO_UNITS',
  three_units = 'THREE_UNITS',
  four_units = 'FOUR_UNITS',
}

export enum LoanCitizenshipEnum {
  default = '',
  us_citizen = 'US_CITIZEN',
  permanent_resident_alien = 'PERMANENT_RESIDENT_ALIEN',
  foreign_national = 'FOREIGN_NATIONAL',
}

export interface StartingQuestionFormData {
  loanType: LoanTypeEnum;
  productCategory: LoanProductCategoryEnum;
  loanPurpose: LoanPurposeEnum;
  propertyType: LoanPropertyTypeEnum;
  propertyUnit: LoanPropertyUnitEnum;
  isOccupyProperty: boolean;
}
