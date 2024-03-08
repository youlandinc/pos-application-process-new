import { get, post, put } from '../axios';
import { CustomRateData, RatesProductData } from '@/types/dashboard';
import {
  BPEstimateRateData,
  BREstimateRateData,
  FPEstimateRateData,
  FREstimateRateData,
  GPEstimateRateData,
  GREstimateRateData,
  MortgagePropertyNewData,
  MortgageStartingData,
  MRStartingData,
} from '@/types/application';

export const _fetchRatesProduct = (processInsId = '') => {
  return get(`/dashboard/rate/${processInsId}/all`);
};

export const _fetchRatesProductSelected = (processInsId = '') => {
  return get<RatesProductData>(`/dashboard/rate/${processInsId}/my`);
};

type FetchProductMapPreviewQueryData =
  | MPQueryData
  | MRQueryData
  | BPQueryData
  | BRQueryData
  | FPQueryData
  | FRQueryData
  | GPQueryData
  | GRQueryData;

export type MPQueryData = MortgagePropertyNewData &
  Partial<
    Pick<MortgageStartingData, 'propertyOpt' | 'numberOfUnits' | 'propAddr'>
  >;

export type MRQueryData = Pick<MRStartingData, 'homeValue'> & {
  taxAndInsurance: string;
  upfrontCost: string;
};

export type BPQueryData = BPEstimateRateData;
export type BRQueryData = BREstimateRateData;

export type FPQueryData = FPEstimateRateData;
export type FRQueryData = FREstimateRateData;

export type GPQueryData = GPEstimateRateData;
export type GRQueryData = GREstimateRateData;

export const _fetchRatesProductPreview = (
  processInsId = '',
  postData: FetchProductMapPreviewQueryData,
) => {
  return post(`/dashboard/rate/${processInsId}/all/preview`, postData);
};

export type UpdateRatesPostData = Partial<
  Pick<RatesProductData, 'id'> & {
    queryParams: FetchProductMapPreviewQueryData;
  }
>;

export const _updateRatesProductSelected = (
  processInsId = '',
  postData: UpdateRatesPostData,
) => {
  return put(`/dashboard/rate/${processInsId}`, postData);
};

export const _fetchRatesLoanInfo = (processInsId = '') => {
  return get(`/dashboard/rate/${processInsId}/info`);
};

export const _fetchCustomRates = (
  processInsId = '',
  postData: CustomRateData,
) => {
  return post(`/dashboard/rate/${processInsId}/custom`, postData);
};
