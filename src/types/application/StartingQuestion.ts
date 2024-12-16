export enum LoanTypeEnum {
  mortgage = 'MORTGAGE',
  bridge = 'BRIDGE',
}

export enum LoanProductCategoryEnum {
  default = '',
  stabilized_bridge = 'STABILIZED_BRIDGE',
  fix_and_flip = 'FIX_AND_FLIP',
  ground_up_construction = 'GROUND_UP_CONSTRUCTION',
  dscr_rental = 'DSCR_RENTAL',
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
  multifamily = 'MULTIFAMILY',
  commercial = 'COMMERCIAL',
}

export enum LoanPropertyUnitEnum {
  default = '',
  two_units = 'TWO_UNITS',
  three_units = 'THREE_UNITS',
  four_units = 'FOUR_UNITS',
  five_units = 'FIVE_UNITS',
  six_units = 'SIX_UNITS',
  seven_units = 'SEVEN_UNITS',
  eight_units = 'EIGHT_UNITS',
  nine_units = 'NINE_UNITS',
  ten_units = 'TEN_UNITS',
  eleven_units = 'ELEVEN_UNITS',
  twelve_units = 'TWELVE_UNITS',
  thirteen_units = 'THIRTEEN_UNITS',
  fourteen_units = 'FOURTEEN_UNITS',
  fifteen_units = 'FIFTEEN_UNITS',
  sixteen_units = 'SIXTEEN_UNITS',
  seventeen_units = 'SEVENTEEN_UNITS',
  eighteen_units = 'EIGHTEEN_UNITS',
  nineteen_units = 'NINETEEN_UNITS',
  twenty_plus_units = 'TWENTY_PLUS_UNITS',
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
