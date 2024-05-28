export enum PropertyNumberOpt {
  default = '',
  zero = 'none',
  one_to_four = 'one_to_four',
  five_more = 'five_more',
}

export enum ProcessOpt {
  researching = 'researching',
  makingOffer = 'making_offer',
  signedPurchase = 'signed_purchase',
  default = '',
}

export enum OfferOpt {
  preApproval = 'pre_approval',
  isAfford = 'is_afford',
  realEstate = 'real_estate',
  default = '',
}

export enum PurchaseTimeOpt {
  quarter = 'quarter',
  half = 'half',
  year = 'year',
  notSure = 'not_sure',
  default = '',
}

export enum OccupancyOpt {
  primaryResidence = 'primary_residence',
  secondHome = 'second_home',
  investmentProperty = 'investment_property',
  default = '',
}

export enum PropertyOpt {
  default = '',
  singleFamily = 'single_family',
  townhouse = 'townhouse',
  condo = 'condo',
  twoToFourFamily = 'two_to_four_family',
}

export enum PropertyUnitOpt {
  default = 0,
  twoUnits = 2,
  threeUnits = 3,
  fourUnits = 4,
}

export enum RelationshipOpt {
  unmarried = 'unmarried',
  married = 'married',
  legallySeparated = 'legally_separated',
  default = '',
}

export enum PropertyPlanOpt {
  sellIt = 'sell_it',
  keepIt = 'keep_it',
  default = '',
}

export enum PropertyTitleOpt {
  byYourself = 'by_yourself',
  jointlyWithSpouse = 'jointly_with_spouse',
  jointlyWithAnotherPerson = 'jointly_with_another_person',
  default = '',
}

export enum PropertyPurposeOpt {
  default = '',
  secondHome = 'second_home',
  investment = 'investment_property',
}

export enum DebtWrongReasonOpt {
  had_paid = 'had_paid',
  default = '',
  co_signer_pays = 'co_signer_pays',
  employer_pays = 'employer_pays',
}

export enum WhyRefinanceOpt {
  lowerPayment = 'lower_my_monthly_payment',
  cashOut = 'take_cash_out',
  payoffExist = 'payoff_existing',
  consolidateDebts = 'consolidate_debts',
  default = '',
}
