import {
  FixStartingData,
  FPEstimateRateData,
  FREstimateRateData,
} from '@/types/application';
import { BaseOverviewSummaryData, BasePreApprovalLetterData } from '@/types';

export type FPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
};

export type FROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type FPRatesLoanInfo = Pick<
  FPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FRRatesLoanInfo = Pick<
  FREstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FPPreApprovalLetterData = BasePreApprovalLetterData &
  FPEstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type FRPreApprovalLetterData = BasePreApprovalLetterData &
  FREstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
