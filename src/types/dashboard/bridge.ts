import {
  BPEstimateRateData,
  BREstimateRateData,
  BridgeStartingData,
} from '@/types/application';
import { BaseOverviewSummaryData, BasePreApprovalLetterData } from '@/types';
import { PropertyOpt } from '@/types/options';

export type BridgeOverviewDetail = {
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  penalty: number;
  lien: string;
  arv: number;
  ltc: number;
  ltv: number;
};

export type BridgeOverviewThirdParty = {
  totalClosingCash: number;
  downPayment?: number;
  originationFee: number;
  originationFeePer: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
};

export type BPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
};

export type BPRatesLoanInfo = Pick<
  BPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type BPPreApprovalLetterData = BasePreApprovalLetterData &
  BPEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type BROverviewSummaryData = BaseOverviewSummaryData & {
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

export type BRRatesLoanInfo = Pick<
  BREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type BRPreApprovalLetterData = BasePreApprovalLetterData &
  BREstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
