import { QualificationACHAccountType } from '@/types';

export const QUALIFICATION_ACH_ACCOUNT_TYPE: Option[] = [
  {
    key: QualificationACHAccountType.checking,
    value: QualificationACHAccountType.checking,
    label: 'Checking',
  },
  {
    key: QualificationACHAccountType.savings,
    value: QualificationACHAccountType.savings,
    label: 'Savings',
  },
];
