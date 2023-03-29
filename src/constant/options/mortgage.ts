import { LoanType } from '@/types/enum';
import {
  DebtWrongReasonOpt,
  OccupancyOpt,
  OfferOpt,
  PropertyOpt,
  PropPlanOpt,
  PropPurposeOpt,
  PropTitleOpt,
  PurchaseTimeOpt,
  RelationshipOpt,
  StageOpt,
  UnitOpt,
  WhyRefinanceOpt,
} from '@/types/options';

export const OPTION_MORTGAGE_PROPERTY: {
  [key: string]: Option[];
} = {
  occupancyOpt: [
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
  ],
  propertyOpt: [
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
  ],
  numberOfUnits: [
    {
      key: UnitOpt.twoUnits + '',
      value: UnitOpt.twoUnits,
      label: '2 Units',
    },
    {
      key: UnitOpt.threeUnits + '',
      value: UnitOpt.threeUnits,
      label: '3 Units',
    },
    {
      key: UnitOpt.fourUnits + '',
      value: UnitOpt.fourUnits,
      label: '4 Units',
    },
  ],
};

export const OPTION_MORTGAGE_PURCHASEPURPOS: {
  [key: string]: Option[];
} = {
  process: [
    {
      key: StageOpt.researching,
      value: StageOpt.researching,
      label: "I'm just researching",
    },
    {
      key: StageOpt.makingOffer,
      value: StageOpt.makingOffer,
      label: "I'm making offers",
    },
    {
      key: StageOpt.signedPurchase,
      value: StageOpt.signedPurchase,
      label: 'I have signed a purchase contract',
    },
  ],
  offer: [
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
  ],
  purchaseTime: [
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
  ],
};

export const OPTION_MORTGAGE_ASSETS: { [key: string]: Option[] } = {
  propertyPlan: [
    {
      value: PropPlanOpt.sellIt,
      key: PropPlanOpt.sellIt,
      label: 'Sell it',
    },
    {
      value: PropPlanOpt.keepIt,
      key: PropPlanOpt.keepIt,
      label: 'Keep it',
    },
  ],
  propertyTitle: [
    {
      value: PropTitleOpt.byYourself,
      key: PropTitleOpt.byYourself,
      label: 'By yourself',
    },
    {
      value: PropTitleOpt.jointlyWithSpouse,
      key: PropTitleOpt.jointlyWithSpouse,
      label: 'Jointly with spouse',
    },
    {
      value: PropTitleOpt.jointlyWithAnotherPerson,
      key: PropTitleOpt.jointlyWithAnotherPerson,
      label: 'Jointly with another person',
    },
  ],
  propertyPurpose: [
    {
      value: PropPurposeOpt.secondHome,
      key: PropPurposeOpt.secondHome,
      label: 'Second home',
    },
    {
      value: PropPurposeOpt.investment,
      key: PropPurposeOpt.investment,
      label: 'Investment',
    },
  ],
  whyRefinance: [
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
  ],
};

export const OPTION_MORTGAGE_COBORROWERRELATIONSHIP = [
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

export const OPTION_MORTGAGE_DEBTWRONG: Option[] = [
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

export const OPTION_MORTGAGE_RATESPRODUCT: Option[] = [
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
