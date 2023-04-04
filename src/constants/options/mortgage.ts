import { LoanType } from '@/types';
import { Options } from '@/types/options';

export const OPTIONS_MORTGAGE_OCCUPANCY: Option[] = [
  {
    key: Options.OccupancyOpt.primaryResidence,
    value: Options.OccupancyOpt.primaryResidence,
    label: 'Primary residence',
  },
  {
    key: Options.OccupancyOpt.secondHome,
    value: Options.OccupancyOpt.secondHome,
    label: 'Second home',
  },
  {
    key: Options.OccupancyOpt.investmentProperty,
    value: Options.OccupancyOpt.investmentProperty,
    label: 'Investment property',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY: Option[] = [
  {
    key: Options.PropertyOpt.singleFamily,
    value: Options.PropertyOpt.singleFamily,
    label: 'Single family',
  },
  {
    key: Options.PropertyOpt.townhouse,
    value: Options.PropertyOpt.townhouse,
    label: 'Townhouse',
  },
  {
    key: Options.PropertyOpt.condo,
    value: Options.PropertyOpt.condo,
    label: 'Condo',
  },
  {
    key: Options.PropertyOpt.twoToFourFamily,
    value: Options.PropertyOpt.twoToFourFamily,
    label: '2-4 Units',
  },
];

export const OPTIONS_MORTGAGE_UNIT: Option[] = [
  {
    key: Options.PropertyUnitOpt.twoUnits + '',
    value: Options.PropertyUnitOpt.twoUnits,
    label: '2 Units',
  },
  {
    key: Options.PropertyUnitOpt.threeUnits + '',
    value: Options.PropertyUnitOpt.threeUnits,
    label: '3 Units',
  },
  {
    key: Options.PropertyUnitOpt.fourUnits + '',
    value: Options.PropertyUnitOpt.fourUnits,
    label: '4 Units',
  },
];

export const OPTIONS_MORTGAGE_PROCESS: Option[] = [
  {
    key: Options.ProcessOpt.researching,
    value: Options.ProcessOpt.researching,
    label: "I'm just researching",
  },
  {
    key: Options.ProcessOpt.makingOffer,
    value: Options.ProcessOpt.makingOffer,
    label: "I'm making offers",
  },
  {
    key: Options.ProcessOpt.signedPurchase,
    value: Options.ProcessOpt.signedPurchase,
    label: 'I have signed a purchase contract',
  },
];

export const OPTIONS_MORTGAGE_OFFER: Option[] = [
  {
    key: Options.OfferOpt.preApproval,
    value: Options.OfferOpt.preApproval,
    label: 'Get a Pre-approval Letter',
  },
  {
    key: Options.OfferOpt.isAfford,
    value: Options.OfferOpt.isAfford,
    label: 'See how much I can afford',
  },
  {
    key: Options.OfferOpt.realEstate,
    value: Options.OfferOpt.realEstate,
    label: 'Find a real estate agent',
  },
];

export const OPTIONS_MORTGAGE_PURCHASE_TIME: Option[] = [
  {
    key: Options.PurchaseTimeOpt.quarter,
    value: Options.PurchaseTimeOpt.quarter,
    label: '0-3 months',
  },
  {
    key: Options.PurchaseTimeOpt.half,
    value: Options.PurchaseTimeOpt.half,
    label: '3-6 months',
  },
  {
    key: Options.PurchaseTimeOpt.year,
    value: Options.PurchaseTimeOpt.year,
    label: '6+ months',
  },
  {
    key: Options.PurchaseTimeOpt.notSure,
    value: Options.PurchaseTimeOpt.notSure,
    label: 'Not sure',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_PLAN: Option[] = [
  {
    value: Options.PropertyPlanOpt.sellIt,
    key: Options.PropertyPlanOpt.sellIt,
    label: 'Sell it',
  },
  {
    value: Options.PropertyPlanOpt.keepIt,
    key: Options.PropertyPlanOpt.keepIt,
    label: 'Keep it',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_TITLE: Option[] = [
  {
    value: Options.PropertyTitleOpt.byYourself,
    key: Options.PropertyTitleOpt.byYourself,
    label: 'By yourself',
  },
  {
    value: Options.PropertyTitleOpt.jointlyWithSpouse,
    key: Options.PropertyTitleOpt.jointlyWithSpouse,
    label: 'Jointly with spouse',
  },
  {
    value: Options.PropertyTitleOpt.jointlyWithAnotherPerson,
    key: Options.PropertyTitleOpt.jointlyWithAnotherPerson,
    label: 'Jointly with another person',
  },
];

export const OPTIONS_MORTGAGE_PROPERTY_PURPOSE: Option[] = [
  {
    value: Options.PropertyPurposeOpt.secondHome,
    key: Options.PropertyPurposeOpt.secondHome,
    label: 'Second home',
  },
  {
    value: Options.PropertyPurposeOpt.investment,
    key: Options.PropertyPurposeOpt.investment,
    label: 'Investment',
  },
];

export const OPTIONS_MORTGAGE_WHY_REFINANCE: Option[] = [
  {
    value: Options.WhyRefinanceOpt.lowerPayment,
    key: Options.WhyRefinanceOpt.lowerPayment,
    label: 'Lower my monthly payment',
  },
  {
    value: Options.WhyRefinanceOpt.cashOut,
    key: Options.WhyRefinanceOpt.cashOut,
    label: 'Take cash out to pay for other expenses',
  },
  {
    value: Options.WhyRefinanceOpt.payoffExist,
    key: Options.WhyRefinanceOpt.payoffExist,
    label: 'Pay off my existing mortgage sooner',
  },
  {
    value: Options.WhyRefinanceOpt.consolidateDebts,
    key: Options.WhyRefinanceOpt.consolidateDebts,
    label: 'Consolidate high-interest debts into a single payment',
  },
];

export const OPTIONS_MORTGAGE_CO_BORROWER_RELATIONSHIP = [
  {
    value: Options.RelationshipOpt.unmarried,
    key: Options.RelationshipOpt.unmarried,
    label: 'Unmarried',
  },
  {
    value: Options.RelationshipOpt.married,
    key: Options.RelationshipOpt.married,
    label: 'Married',
  },
  {
    value: Options.RelationshipOpt.legallySeparated,
    key: Options.RelationshipOpt.legallySeparated,
    label: 'Legally Separated',
  },
];

export const OPTIONS_MORTGAGE_DEBT_WRONG: Option[] = [
  {
    label: 'Balance has been paid and is now $0.',
    key: Options.DebtWrongReasonOpt.had_paid,
    value: Options.DebtWrongReasonOpt.had_paid,
  },
  {
    label: 'Co-signer and someone else pays the bill.',
    key: Options.DebtWrongReasonOpt.co_signer_pays,
    value: Options.DebtWrongReasonOpt.co_signer_pays,
  },
  {
    label: 'Work account that employer pays.',
    key: Options.DebtWrongReasonOpt.employer_pays,
    value: Options.DebtWrongReasonOpt.employer_pays,
  },
  {
    label: '',
    key: Options.DebtWrongReasonOpt.default,
    value: Options.DebtWrongReasonOpt.default,
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
