import {
  LoanAnswerEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
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
    label: 'Below 600',
    key: LoanFicoScoreEnum.below_600,
    value: LoanFicoScoreEnum.below_600,
  },
  {
    label: '600-649',
    key: LoanFicoScoreEnum.between_600_649,
    value: LoanFicoScoreEnum.between_600_649,
  },
  {
    label: '650-699',
    key: LoanFicoScoreEnum.between_650_699,
    value: LoanFicoScoreEnum.between_650_699,
  },
  {
    label: '700-749',
    key: LoanFicoScoreEnum.between_700_749,
    value: LoanFicoScoreEnum.between_700_749,
  },
  {
    label: '750-799',
    key: LoanFicoScoreEnum.between_750_799,
    value: LoanFicoScoreEnum.between_750_799,
  },
  {
    label: '800+',
    key: LoanFicoScoreEnum.above_800,
    value: LoanFicoScoreEnum.above_800,
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
