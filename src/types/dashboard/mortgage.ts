import {
  MortgageFinancialSituationData,
  MortgagePropertyNewData,
  MortgageStartingData,
  MRStartingData,
  MRWhyRefinanceData,
} from '@/types/application';
import {
  BaseOverviewSummaryData,
  BasePreApprovalLetterData,
} from '@/types/dashboard/common';

export type SummaryFinancialSituation = MortgageFinancialSituationData & {
  assetsTotal: number;
};

export type MPOverviewSummaryData = BaseOverviewSummaryData & {
  purchasePrice: number;
  downPayment: number;
  expiredDate: string;
};

export type MROverviewSummaryData = BaseOverviewSummaryData & {
  cashOut: number;
  balance: number;
  homeValue: number;
  address: string;
};

export type MPRatesLoanInfo = MortgagePropertyNewData &
  Pick<MortgageStartingData, 'propertyOpt' | 'numberOfUnits'> & {
    percent?: number;
  };

export type MRRatesLoanInfo = Pick<
  MRStartingData,
  'propertyOpt' | 'homeValue'
> &
  Pick<MRWhyRefinanceData, 'cashOut'> & {
    taxAndInsurance: string;
    upfrontCost: string;
    balance: number;
  };

export type MPPreApprovalLetterData = BasePreApprovalLetterData &
  MortgagePropertyNewData &
  Pick<MortgageStartingData, 'propertyOpt' | 'numberOfUnits' | 'propAddr'>;
