import {
  FixPurchaseEstimateRateData,
  FixRefinanceEstimateRateData,
  FixStartingData,
} from '@/types/application';
import { BaseOverviewSummaryData, BasePreApprovalLetterData } from '@/types';

export type FPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
};

export type FixPurchaseRatesLoanInfo = Pick<
  FixPurchaseEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FPPreApprovalLetterData = BasePreApprovalLetterData &
  FixPurchaseEstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

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

export type FixRefinanceRatesLoanInfo = Pick<
  FixRefinanceEstimateRateData,
  'balance' | 'cashOutAmount' | 'cor'
> & {
  totalLoanAmount: number;
};

export type FRPreApprovalLetterData = BasePreApprovalLetterData &
  FixRefinanceEstimateRateData &
  Pick<FixStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
