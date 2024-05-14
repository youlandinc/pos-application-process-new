import { LoanSnapshotEnum } from '@/types';

export const REQUEST_TIMEOUT = 30000;

export const AUTO_HIDE_DURATION = 3000;

export const TOKEN_WHITE_LIST = [];

export const PAGE_SIZE = 6;

export const GOOGLE_SING_IN_ID =
  '918425391454-tr3mrfhkift48rt5fvs749mebp0kubts.apps.googleusercontent.com';

//export const LOGIN_APP_KEY = 'jcDlAFZpmslrRYwUzfpP';
export const LOGIN_APP_KEY = 'jjHggHfNVaGvkabpQXfs';

export const URL_HASH: Record<string, any> = {
  [LoanSnapshotEnum.starting_question]: '/',
  [LoanSnapshotEnum.estimate_rate]: '/estimate-rate',
  [LoanSnapshotEnum.auth_page]: '/auth-page',
  [LoanSnapshotEnum.loan_address]: '/loan-address',
  [LoanSnapshotEnum.background_information]: '/background-information',
  [LoanSnapshotEnum.compensation_page]: '/compensation-information',
  [LoanSnapshotEnum.loan_summary]: '/loan-summary',
};
