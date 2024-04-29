import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';

export const APPLICATION_STARTING_QUESTION_LOAN_CATEGORY: Option[] = [
  {
    label: 'Stabilized Bridge',
    key: LoanProductCategoryEnum.stabilized_bridge,
    value: LoanProductCategoryEnum.stabilized_bridge,
  },
  {
    label: 'Fix & Flip',
    key: LoanProductCategoryEnum.fix_and_flip,
    value: LoanProductCategoryEnum.fix_and_flip,
  },
  //{
  //  label: 'Ground-up Construction',
  //  key: LoanProductCategoryEnum.ground_up_construction,
  //  value: LoanProductCategoryEnum.ground_up_construction,
  //},
];

export const APPLICATION_STARTING_QUESTION_LOAN_PURPOSE: Option[] = [
  {
    label: 'Purchase',
    key: LoanPurposeEnum.purchase,
    value: LoanPurposeEnum.purchase,
  },
  {
    label: 'Refinance',
    key: LoanPurposeEnum.refinance,
    value: LoanPurposeEnum.refinance,
  },
];

export const APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_TYPE: Option[] = [
  {
    label: 'Single family',
    key: LoanPropertyTypeEnum.single_family,
    value: LoanPropertyTypeEnum.single_family,
  },
  {
    label: 'Townhouse',
    key: LoanPropertyTypeEnum.townhouse,
    value: LoanPropertyTypeEnum.townhouse,
  },
  {
    label: 'Condo',
    key: LoanPropertyTypeEnum.condo,
    value: LoanPropertyTypeEnum.condo,
  },
  {
    label: '2 to 4 units',
    key: LoanPropertyTypeEnum.two_to_four_family,
    value: LoanPropertyTypeEnum.two_to_four_family,
  },
];

export const APPLICATION_STARTING_QUESTION_LOAN_PROPERTY_UNIT: Option[] = [
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
