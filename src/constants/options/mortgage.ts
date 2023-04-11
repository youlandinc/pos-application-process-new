import {
  DebtWrongReasonOpt,
  LoanType,
  OccupancyOpt,
  OfferOpt,
  ProcessOpt,
  PropertyOpt,
  PropertyPlanOpt,
  PropertyPurposeOpt,
  PropertyTitleOpt,
  PropertyUnitOpt,
  PurchaseTimeOpt,
  RelationshipOpt,
  WhyRefinanceOpt,
} from '@/types';

export const OPTIONS_MORTGAGE_OCCUPANCY: Option[] = [
  {
    key: OccupancyOpt.primaryResidence,
    value: OccupancyOpt.primaryResidence,
    label: 'Primary residence',
  },
  {
    key: OccupancyOpt.secondHome,
    value: OccupancyOpt.secondHome,
    label: 'Second home',
  },
  {
    key: OccupancyOpt.investmentProperty,
    value: OccupancyOpt.investmentProperty,
    label: 'Investment property',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY: Option[] = [
  {
    key: PropertyOpt.singleFamily,
    value: PropertyOpt.singleFamily,
    label: 'Single family',
  },
  {
    key: PropertyOpt.townhouse,
    value: PropertyOpt.townhouse,
    label: 'Townhouse',
  },
  {
    key: PropertyOpt.condo,
    value: PropertyOpt.condo,
    label: 'Condo',
  },
  {
    key: PropertyOpt.twoToFourFamily,
    value: PropertyOpt.twoToFourFamily,
    label: '2-4 Units',
  },
];

export const OPTIONS_MORTGAGE_UNIT: Option[] = [
  {
    key: PropertyUnitOpt.twoUnits + '',
    value: PropertyUnitOpt.twoUnits,
    label: '2 Units',
  },
  {
    key: PropertyUnitOpt.threeUnits + '',
    value: PropertyUnitOpt.threeUnits,
    label: '3 Units',
  },
  {
    key: PropertyUnitOpt.fourUnits + '',
    value: PropertyUnitOpt.fourUnits,
    label: '4 Units',
  },
];

export const OPTIONS_MORTGAGE_PROCESS: Option[] = [
  {
    key: ProcessOpt.researching,
    value: ProcessOpt.researching,
    label: "I'm just researching",
  },
  {
    key: ProcessOpt.makingOffer,
    value: ProcessOpt.makingOffer,
    label: "I'm making offers",
  },
  {
    key: ProcessOpt.signedPurchase,
    value: ProcessOpt.signedPurchase,
    label: 'I have signed a purchase contract',
  },
];

export const OPTIONS_MORTGAGE_OFFER: Option[] = [
  {
    key: OfferOpt.preApproval,
    value: OfferOpt.preApproval,
    label: 'Get a Pre-approval Letter',
  },
  {
    key: OfferOpt.isAfford,
    value: OfferOpt.isAfford,
    label: 'See how much I can afford',
  },
  {
    key: OfferOpt.realEstate,
    value: OfferOpt.realEstate,
    label: 'Find a real estate agent',
  },
];

export const OPTIONS_MORTGAGE_PURCHASE_TIME: Option[] = [
  {
    key: PurchaseTimeOpt.quarter,
    value: PurchaseTimeOpt.quarter,
    label: '0-3 months',
  },
  {
    key: PurchaseTimeOpt.half,
    value: PurchaseTimeOpt.half,
    label: '3-6 months',
  },
  {
    key: PurchaseTimeOpt.year,
    value: PurchaseTimeOpt.year,
    label: '6+ months',
  },
  {
    key: PurchaseTimeOpt.notSure,
    value: PurchaseTimeOpt.notSure,
    label: 'Not sure',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_PLAN: Option[] = [
  {
    value: PropertyPlanOpt.sellIt,
    key: PropertyPlanOpt.sellIt,
    label: 'Sell it',
  },
  {
    value: PropertyPlanOpt.keepIt,
    key: PropertyPlanOpt.keepIt,
    label: 'Keep it',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_TITLE: Option[] = [
  {
    value: PropertyTitleOpt.byYourself,
    key: PropertyTitleOpt.byYourself,
    label: 'By yourself',
  },
  {
    value: PropertyTitleOpt.jointlyWithSpouse,
    key: PropertyTitleOpt.jointlyWithSpouse,
    label: 'Jointly with spouse',
  },
  {
    value: PropertyTitleOpt.jointlyWithAnotherPerson,
    key: PropertyTitleOpt.jointlyWithAnotherPerson,
    label: 'Jointly with another person',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_PURPOSE: Option[] = [
  {
    value: PropertyPurposeOpt.secondHome,
    key: PropertyPurposeOpt.secondHome,
    label: 'Second home',
  },
  {
    value: PropertyPurposeOpt.investment,
    key: PropertyPurposeOpt.investment,
    label: 'Investment',
  },
];

export const OPTIONS_MORTGAGE_WHY_REFINANCE: Option[] = [
  {
    value: WhyRefinanceOpt.lowerPayment,
    key: WhyRefinanceOpt.lowerPayment,
    label: 'Lower my monthly payment',
  },
  {
    value: WhyRefinanceOpt.cashOut,
    key: WhyRefinanceOpt.cashOut,
    label: 'Take cash out to pay for other expenses',
  },
  {
    value: WhyRefinanceOpt.payoffExist,
    key: WhyRefinanceOpt.payoffExist,
    label: 'Pay off my existing mortgage sooner',
  },
  {
    value: WhyRefinanceOpt.consolidateDebts,
    key: WhyRefinanceOpt.consolidateDebts,
    label: 'Consolidate high-interest debts into a single payment',
  },
];

export const OPTIONS_MORTGAGE_CO_BORROWER_RELATIONSHIP = [
  {
    value: RelationshipOpt.unmarried,
    key: RelationshipOpt.unmarried,
    label: 'Unmarried',
  },
  {
    value: RelationshipOpt.married,
    key: RelationshipOpt.married,
    label: 'Married',
  },
  {
    value: RelationshipOpt.legallySeparated,
    key: RelationshipOpt.legallySeparated,
    label: 'Legally Separated',
  },
];

export const OPTIONS_MORTGAGE_DEBT_WRONG: Option[] = [
  {
    label: 'Balance has been paid and is now $0.',
    key: DebtWrongReasonOpt.had_paid,
    value: DebtWrongReasonOpt.had_paid,
  },
  {
    label: 'Co-signer and someone else pays the bill.',
    key: DebtWrongReasonOpt.co_signer_pays,
    value: DebtWrongReasonOpt.co_signer_pays,
  },
  {
    label: 'Work account that employer pays.',
    key: DebtWrongReasonOpt.employer_pays,
    value: DebtWrongReasonOpt.employer_pays,
  },
  {
    label: '',
    key: DebtWrongReasonOpt.default,
    value: DebtWrongReasonOpt.default,
  },
];

export const OPTIONS_MORTGAGE_RATES_PRODUCT: Option[] = [
  {
    key: LoanType.UNCATEGORIZED,
    value: LoanType.UNCATEGORIZED,
    label: 'Uncategorized',
  },
  {
    key: LoanType.ADJUSTABLE_51,
    value: LoanType.ADJUSTABLE_51,
    label: '5/1 Adjustable',
  },
  {
    key: LoanType.ADJUSTABLE_71,
    value: LoanType.ADJUSTABLE_71,
    label: '7/1 Adjustable',
  },
  {
    key: LoanType.FIXED_YEAR_5,
    value: LoanType.FIXED_YEAR_5,
    label: '5-Year Fixed',
  },
  {
    key: LoanType.FIXED_YEAR_10,
    value: LoanType.FIXED_YEAR_10,
    label: '10-Year Fixed',
  },
  {
    key: LoanType.FIXED_YEAR_15,
    value: LoanType.FIXED_YEAR_15,
    label: '15-Year Fixed',
  },
  {
    key: LoanType.FIXED_YEAR_20,
    value: LoanType.FIXED_YEAR_20,
    label: '20-Year Fixed',
  },
  {
    key: LoanType.FIXED_YEAR_25,
    value: LoanType.FIXED_YEAR_25,
    label: '25-Year Fixed',
  },
  {
    key: LoanType.FIXED_YEAR_30,
    value: LoanType.FIXED_YEAR_30,
    label: '30-Year Fixed',
  },
];
