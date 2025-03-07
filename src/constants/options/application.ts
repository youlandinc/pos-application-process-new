import {
  LoanAnswerEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  PrepaymentPenaltyEnum,
} from '@/types';

export const APPLICATION_LOAN_CATEGORY: Option[] = [
  {
    label: 'Stabilized Bridge',
    key: LoanProductCategoryEnum.stabilized_bridge,
    value: LoanProductCategoryEnum.stabilized_bridge,
    tooltip:
      'A short-term loan for properties that do not require rehabilitation',
  },
  {
    label: 'Fix and Flip',
    key: LoanProductCategoryEnum.fix_and_flip,
    value: LoanProductCategoryEnum.fix_and_flip,
    tooltip:
      'A short-term loan for properties that requires rehabilitation, covering both the purchase and rehabilitation costs',
  },
  {
    label: 'Ground Up Construction',
    key: LoanProductCategoryEnum.ground_up_construction,
    value: LoanProductCategoryEnum.ground_up_construction,
    tooltip:
      'Used to finance the construction of a new property from the ground up, covering costs from land purchase to completion of the building',
  },
  {
    label: 'DSCR Rental',
    key: LoanProductCategoryEnum.dscr_rental,
    value: LoanProductCategoryEnum.dscr_rental,
    tooltip: "A rental loan based on the property's projected cash flow",
  },
];

export const APPLICATION_LOAN_PURPOSE: Option[] = [
  {
    label: 'Purchase',
    key: LoanPurposeEnum.purchase,
    value: LoanPurposeEnum.purchase,
    tooltip:
      'Used to buy a new property, covering the initial cost of acquisition',
  },
  {
    label: 'Refinance',
    key: LoanPurposeEnum.refinance,
    value: LoanPurposeEnum.refinance,
    tooltip:
      'Used to replace an existing loan with a new one, often to secure better terms, adjust the repayment schedule, or access additional funds based on the current property value',
  },
];

export const APPLICATION_PROPERTY_TYPE: Option[] = [
  {
    label: 'Single family',
    key: LoanPropertyTypeEnum.single_family,
    value: LoanPropertyTypeEnum.single_family,
    tooltip:
      'A standalone home designed for one family. It does not share walls with other houses',
  },
  {
    label: 'Townhouse',
    key: LoanPropertyTypeEnum.townhouse,
    value: LoanPropertyTypeEnum.townhouse,
    tooltip:
      'A multi-story residential unit attached to neighboring units, sharing one or more walls',
  },
  {
    label: 'Condo',
    key: LoanPropertyTypeEnum.condo,
    value: LoanPropertyTypeEnum.condo,
    tooltip:
      'An individually owned unit within a larger property, often with shared common areas and amenities',
  },
  {
    label: '2 to 4 units',
    key: LoanPropertyTypeEnum.two_to_four_family,
    value: LoanPropertyTypeEnum.two_to_four_family,
    tooltip: 'A multi-family property with 2 to 4 rental units',
  },
  {
    label: 'Multifamily (5+ units)',
    key: LoanPropertyTypeEnum.multifamily,
    value: LoanPropertyTypeEnum.multifamily,
    tooltip: 'A property with 5 or more rental units',
  },
  {
    label: 'Commercial',
    key: LoanPropertyTypeEnum.commercial,
    value: LoanPropertyTypeEnum.commercial,
    tooltip:
      'A property designed for business activities or mixed use (combining residential and commercial units). Includes malls, offices, restaurants, industrial estates and more.',
  },
];

export const APPLICATION_PROPERTY_UNIT: Option[] = [
  {
    label: '2 units',
    key: LoanPropertyUnitEnum.two_units,
    value: LoanPropertyUnitEnum.two_units,
  },
  {
    label: '3 units',
    key: LoanPropertyUnitEnum.three_units,
    value: LoanPropertyUnitEnum.three_units,
  },
  {
    label: '4 units',
    key: LoanPropertyUnitEnum.four_units,
    value: LoanPropertyUnitEnum.four_units,
  },
];

export const APPLICATION_FICO_SCORE: Option[] = [
  {
    label: 'FICO not available',
    key: LoanFicoScoreEnum.fico_not_available,
    value: LoanFicoScoreEnum.fico_not_available,
  },
  {
    label: 'Below 650',
    key: LoanFicoScoreEnum.below_650,
    value: LoanFicoScoreEnum.below_650,
  },
  {
    label: '650-670',
    value: LoanFicoScoreEnum.between_650_670,
    key: LoanFicoScoreEnum.between_650_670,
  },
  {
    label: '670-700',
    value: LoanFicoScoreEnum.between_670_700,
    key: LoanFicoScoreEnum.between_670_700,
  },
  {
    label: '700-730',
    value: LoanFicoScoreEnum.between_700_730,
    key: LoanFicoScoreEnum.between_700_730,
  },
  {
    label: '730-760',
    value: LoanFicoScoreEnum.between_730_760,
    key: LoanFicoScoreEnum.between_730_760,
  },
  {
    label: '760-790',
    value: LoanFicoScoreEnum.between_760_790,
    key: LoanFicoScoreEnum.between_760_790,
  },
  {
    label: '790+',
    value: LoanFicoScoreEnum.above_790,
    key: LoanFicoScoreEnum.above_790,
  },
];

export const APPLICATION_LIQUIDITY: Option[] = [
  {
    label: 'Fill out liquidity amount',
    key: LoanAnswerEnum.yes,
    value: LoanAnswerEnum.yes,
  },
  {
    label: 'Not sure',
    key: LoanAnswerEnum.no,
    value: LoanAnswerEnum.no,
  },
];

export const APPLICATION_PREPAYMENT_PENALTY: Option[] = [
  {
    label: '3-year term',
    key: PrepaymentPenaltyEnum.three_year,
    value: PrepaymentPenaltyEnum.three_year,
  },
  {
    label: '5-year term',
    key: PrepaymentPenaltyEnum.five_year,
    value: PrepaymentPenaltyEnum.five_year,
  },
  {
    label: '7-year term',
    key: PrepaymentPenaltyEnum.seven_year,
    value: PrepaymentPenaltyEnum.seven_year,
  },
];
