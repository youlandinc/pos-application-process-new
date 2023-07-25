import {
  BridgePurchaseEstimateRateData,
  BridgeRefinanceEstimateRateData,
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

export type BridgePurchaseRatesLoanInfo = Pick<
  BridgePurchaseEstimateRateData,
  'purchasePrice' | 'purchaseLoanAmount'
> & {
  totalLoanAmount: number;
};

export type BPPreApprovalLetterData = BasePreApprovalLetterData &
  BridgePurchaseEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;

export type BROverviewSummaryData = BaseOverviewSummaryData & {
  homeValue: number;
  balance: number;
  cashOutAmount: number;
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
};

export type BridgeRefinanceRatesLoanInfo = Pick<
  BridgeRefinanceEstimateRateData,
  'balance' | 'cashOutAmount'
> & {
  totalLoanAmount: number;
};

export type BRPreApprovalLetterData = BasePreApprovalLetterData &
  BridgeRefinanceEstimateRateData &
  Pick<BridgeStartingData, 'propertyType' | 'propertyUnit' | 'propAddr'>;
