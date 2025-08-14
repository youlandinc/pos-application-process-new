import { DashboardTaskKey, LoanSnapshotEnum } from '@/types';

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
  [LoanSnapshotEnum.land_readiness]: '/land-readiness',
  [LoanSnapshotEnum.estimate_rate]: '/estimate-rate',
  [LoanSnapshotEnum.auth_page]: '/auth-page',
  [LoanSnapshotEnum.loan_address]: '/loan-address',
  [LoanSnapshotEnum.background_information]: '/background-information',
  [LoanSnapshotEnum.select_executive]: '/select-executive',
  [LoanSnapshotEnum.compensation_page]: '/compensation-information',
  [LoanSnapshotEnum.loan_summary]: '/loan-summary',
  [LoanSnapshotEnum.enter_loan_info]: '/loan-information',
  [LoanSnapshotEnum.contact_info]: '/submit-lead',
  [LoanSnapshotEnum.thank_you_page]: '/submit-lead-success',
};

export const TASK_URL_HASH: Record<string, any> = {
  [DashboardTaskKey.payoff_amount]: '/dashboard/tasks/payoff-amount',
  [DashboardTaskKey.rehab_info]: '/dashboard/tasks/rehab-info',
  [DashboardTaskKey.square_footage]: '/dashboard/tasks/square-footage',
  [DashboardTaskKey.entitlements]: '/dashboard/tasks/entitlements',
  [DashboardTaskKey.permits_obtained]: '/dashboard/tasks/permits-obtained',
  [DashboardTaskKey.borrower]: '/dashboard/tasks/borrower',
  [DashboardTaskKey.co_borrower]: '/dashboard/tasks/co-borrower',
  [DashboardTaskKey.demographics]: '/dashboard/tasks/demographics-information',
  [DashboardTaskKey.title_escrow]: '/dashboard/tasks/title-or-escrow-company',
  [DashboardTaskKey.holdback_process]:
    '/dashboard/tasks/construction-holdback-process',
  [DashboardTaskKey.referring_broker]: '/dashboard/tasks/referring-broker',
};
