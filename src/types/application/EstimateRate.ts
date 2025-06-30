import {
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';

export enum LoanFicoScoreEnum {
  default = '',
  no_fico = 'NO_FICO',
  fico_not_available = 'FICO_NOT_AVAILABLE',
  //below_600 = 'BELOW_600',
  //between_600_649 = 'BETWEEN_600_649',
  //between_650_699 = 'BETWEEN_650_699',
  //between_700_749 = 'BETWEEN_700_749',
  //between_750_799 = 'BETWEEN_750_799',
  //above_800 = 'ABOVE_800',
  //2025/03/05 add
  below_650 = 'BELOW_650',
  between_650_670 = 'BETWEEN_650_670',
  between_670_700 = 'BETWEEN_670_700',
  between_700_730 = 'BETWEEN_700_730',
  between_730_760 = 'BETWEEN_730_760',
  between_760_790 = 'BETWEEN_760_790',
  above_790 = 'ABOVE_790',
}

export interface ProductItemProps {
  id: string;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  selected: boolean;
  lowest: boolean;
  initialMonthlyPayment?: number;
  fullyDrawnMonthlyPayment?: number;
}

export interface EstimateRateFormData {
  productCategory: LoanProductCategoryEnum;
  loanPurpose: LoanPurposeEnum;
  propertyType: LoanPropertyTypeEnum;
  propertyUnit: LoanPropertyUnitEnum | null;
  citizenship: LoanCitizenshipEnum;
  priorExperience: number;
  state: string;
  ficoScore: LoanFicoScoreEnum;
  isLiquidity: boolean;
  liquidityAmount: number;
  rehabCost: number;
  arv: number;
  ltc: number;
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
  propertyOwned: LoanAnswerEnum;
  improvementsSinceAcquisition: number;
  constructionProjectsExited: number;
  purchaseConstructionCosts: number;
  refinanceConstructionCosts: number;
  // summary
  initialDisbursement?: number;
  fullDrawnMonthlyPayment?: number;
  futureConstructionFunding?: number;
  // for rental
  monthlyIncome?: number;
  operatingExpense?: number;
  propertyInsurance?: number;
  propertyTaxes?: number;
  vacancyRate?: number;
  monthlyHoaFee?: number;
  prepaymentPenalty: string;
  acquisitionDate: string;
}
