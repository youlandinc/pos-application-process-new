import {
  QualificationACHAccountType,
  QualificationQuestionnaireLicenseType,
} from '@/types';

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

export const QUALIFICATION_QUESTIONNAIRE_LICENSE_TYPE: Option[] = [
  {
    label: 'NMLS',
    key: QualificationQuestionnaireLicenseType.nmls,
    value: QualificationQuestionnaireLicenseType.nmls,
  },
  {
    label: 'DRE Broker',
    key: QualificationQuestionnaireLicenseType.dre_broker,
    value: QualificationQuestionnaireLicenseType.dre_broker,
  },
  {
    label: 'DRE Salesperson',
    key: QualificationQuestionnaireLicenseType.dre_salesperson,
    value: QualificationQuestionnaireLicenseType.dre_salesperson,
  },
];
