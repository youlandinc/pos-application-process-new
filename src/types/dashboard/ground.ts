import {
  GPEstimateRateData,
  GREstimateRateData,
  GroundStartingData,
} from '@/types/application';
import { BaseOverviewSummaryData, BasePreApprovalLetterData } from '@/types';
import { PropertyOpt } from '@/types/options';

export type GroundOverviewDetail = {
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  penalty: number;
  lien: string;
  arv: number;
  ltc: number;
  ltv: number;
};

export type GroundOverviewThirdParty = {
  totalClosingCash: number;
  downPayment?: number;
  originationFee: number;
  originationFeePer: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
};

export type GPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
};

export type GroundPurchaseRatesLoanInfo = Pick<
  GPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type GPPreApprovalLetterData = BasePreApprovalLetterData &
  GPEstimateRateData &
  Pick<GroundStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type GROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
  isCashOut: boolean;
};

export type GroundRefinanceRatesLoanInfo = Pick<
  GREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type GRPreApprovalLetterData = BasePreApprovalLetterData &
  GREstimateRateData &
  Pick<GroundStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
