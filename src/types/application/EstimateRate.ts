import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';

export enum LoanFicoScoreEnum {
  default = '',
  fico_not_available = 'FICO_NOT_AVAILABLE',
  below_600 = 'BELOW_600',
  between_600_649 = 'BETWEEN_600_649',
  between_650_699 = 'BETWEEN_650_699',
  between_700_749 = 'BETWEEN_700_749',
  between_750_799 = 'BETWEEN_750_799',
  above_800 = 'ABOVE_800',
}

export interface ProductItemProps {
  id: string;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  selected: boolean;
  lowest: boolean;
}

export interface EstimateRateFormData {
  productCategory: LoanProductCategoryEnum;
  loanPurpose: LoanPurposeEnum;
  propertyType: LoanPropertyTypeEnum;
  propertyUnit: LoanPropertyUnitEnum;
  state: string;
  ficoScore: LoanFicoScoreEnum;
  isLiquidity: boolean;
  liquidityAmount: number;
  rehabCost: number;
  arv: number;
  purchasePrice: number;
  purchaseLoanAmount: number;
  propertyValue: number;
  refinanceLoanAmount: number;
  isPayoff: boolean;
  payoffAmount: number;
  isCustom: boolean;
  loanTerm: number;
  interestRate: number;
  isDutch: boolean;
}
