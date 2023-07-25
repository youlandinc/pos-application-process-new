import {
  BPEstimateRateData,
  BREstimateRateData,
  BridgeStartingData,
} from '@/types/application';
import { BaseOverviewSummaryData, BasePreApprovalLetterData } from '@/types';

export type BPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  purchaseLoanAmount: number;
  firstName: string;
  lastName: string;
  address: string;
};

export type BROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type BPRatesLoanInfo = Pick<
  BPEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount'
> & {
  totalLoanAmount: number;
};

export type BRRatesLoanInfo = Pick<
  BREstimateRateData,
  'balance' | 'cashOutAmount'
> & {
  totalLoanAmount: number;
};

export type BPPreApprovalLetterData = BasePreApprovalLetterData &
  BPEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type BRPreApprovalLetterData = BasePreApprovalLetterData &
  BREstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
