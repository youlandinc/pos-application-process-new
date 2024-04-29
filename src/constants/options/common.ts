import {
  AppraisalStage,
  CommonBorrowerType,
  LoanAnswerEnum,
  UserType,
} from '@/types';
import { ReactNode } from 'react';

export const HASH_COMMON_PERSON = {
  [UserType.CUSTOMER]: {
    subject: 'you',
    pronoun: 'your',
    third_subject: 'yourself',
    third_pronoun: 'your',
    the_third_subject: 'yourself',
    the_third_pronoun: 'your',
    the_pronoun: 'your',
    the_oneself: 'my',
  },
  [UserType.BROKER]: {
    subject: 'the borrower',
    pronoun: "borrower's",
    third_subject: 'borrower',
    third_pronoun: 'their',
    the_third_subject: 'the borrower',
    the_third_pronoun: 'the borrower',
    the_pronoun: "the borrower's",
    the_oneself: "the borrower's",
  },
  [UserType.LENDER]: {
    subject: 'the borrower',
    pronoun: "borrower's",
    third_subject: 'borrower',
    third_pronoun: 'their',
    the_third_subject: 'the borrower',
    the_third_pronoun: 'the borrower',
    the_pronoun: "the borrower's",
    the_oneself: "the borrower's",
  },
  [UserType.REAL_ESTATE_AGENT]: {
    subject: 'the borrower',
    pronoun: "borrower's",
    third_subject: 'borrower',
    third_pronoun: 'their',
    the_third_subject: 'the borrower',
    the_third_pronoun: 'the borrower',
    the_pronoun: "the borrower's",
    the_oneself: "the borrower's",
  },
  [UserType.LOAN_OFFICER]: {
    subject: 'the borrower',
    pronoun: "borrower's",
    third_subject: 'borrower',
    third_pronoun: 'their',
    the_third_subject: 'the borrower',
    the_third_pronoun: 'the borrower',
    the_pronoun: "the borrower's",
    the_oneself: "the borrower's",
  },
};

export const OPTIONS_COMMON_CITIZEN_TYPE: Option[] = [
  {
    label: 'US citizen',
    value: CommonBorrowerType.us_citizen,
    key: CommonBorrowerType.us_citizen,
  },
  {
    label: 'Permanent Resident-Alien',
    value: CommonBorrowerType.permanent_resident_alien,
    key: CommonBorrowerType.permanent_resident_alien,
  },
  {
    label: 'Foreign national',
    value: CommonBorrowerType.foreign_national,
    key: CommonBorrowerType.foreign_national,
  },
];

export const OPTIONS_COMMON_YES_OR_NO: Option[] = [
  {
    label: 'Yes',
    value: LoanAnswerEnum.yes,
    key: LoanAnswerEnum.yes,
  },
  {
    label: 'No',
    value: LoanAnswerEnum.no,
    key: LoanAnswerEnum.no,
  },
];

export const OPTIONS_COMMON_YES_OR_NOT_SURE: Option[] = [
  {
    label: 'Yes',
    value: LoanAnswerEnum.yes,
    key: LoanAnswerEnum.yes,
  },
  {
    label: 'Not sure',
    value: LoanAnswerEnum.no,
    key: LoanAnswerEnum.no,
  },
];

export const OPTIONS_COMMON_LOAN_ANSWER: Option[] = [
  {
    label: 'Yes',
    value: LoanAnswerEnum.yes,
    key: LoanAnswerEnum.yes,
  },
  {
    label: 'No',
    value: LoanAnswerEnum.no,
    key: LoanAnswerEnum.no,
  },
  {
    label: 'Not sure',
    value: LoanAnswerEnum.not_sure,
    key: LoanAnswerEnum.not_sure,
  },
];

export const OPTIONS_COMMON_USER_TYPE: Option[] = [
  {
    label: 'Borrower',
    key: UserType.CUSTOMER,
    value: UserType.CUSTOMER,
  },
  {
    label: 'Broker',
    key: UserType.BROKER,
    value: UserType.BROKER,
  },
  {
    label: 'Real Estate Agent',
    key: UserType.REAL_ESTATE_AGENT,
    value: UserType.REAL_ESTATE_AGENT,
  },
  {
    label: 'Loan Officer',
    key: UserType.LOAN_OFFICER,
    value: UserType.LOAN_OFFICER,
  },
  {
    label: 'Lender',
    key: UserType.LENDER,
    value: UserType.LENDER,
  },
];

export const OPTIONS_SIGN_UP_ROLE: Option[] = [
  {
    label: 'Borrower',
    key: UserType.CUSTOMER,
    value: UserType.CUSTOMER,
  },
  {
    label: 'Broker',
    key: UserType.BROKER,
    value: UserType.BROKER,
  },
  {
    label: 'Real Estate Agent',
    key: UserType.REAL_ESTATE_AGENT,
    value: UserType.REAL_ESTATE_AGENT,
  },
  {
    label: 'Loan Officer',
    key: UserType.LOAN_OFFICER,
    value: UserType.LOAN_OFFICER,
  },
];

export const OPTIONS_COMMON_STATE: Option[] = [
  { label: 'Alabama', value: 'AL', key: 'AL' },
  {
    label: 'Alaska',
    value: 'AK',
    key: 'AK',
  },
  { label: 'American Samoa', value: 'AS', key: 'AS' },
  {
    label: 'Arizona',
    value: 'AZ',
    key: 'AZ',
  },
  { label: 'Arkansas', value: 'AR', key: 'AR' },
  {
    label: 'California',
    value: 'CA',
    key: 'CA',
  },
  { label: 'Colorado', value: 'CO', key: 'CO' },
  {
    label: 'Connecticut',
    value: 'CT',
    key: 'CT',
  },
  { label: 'Delaware', value: 'DE', key: 'DE' },
  {
    label: 'District Of Columbia',
    value: 'DC',
    key: 'DC',
  },
  { label: 'Federated States Of Micronesia', value: 'FM', key: 'FM' },
  {
    label: 'Florida',
    value: 'FL',
    key: 'FL',
  },
  { label: 'Georgia', value: 'GA', key: 'GA' },
  {
    label: 'Guam',
    value: 'GU',
    key: 'GU',
  },
  { label: 'Hawaii', value: 'HI', key: 'HI' },
  {
    label: 'Idaho',
    value: 'ID',
    key: 'ID',
  },
  { label: 'Illinois', value: 'IL', key: 'IL' },
  {
    label: 'Indiana',
    value: 'IN',
    key: 'IN',
  },
  { label: 'Iowa', value: 'IA', key: 'IA' },
  {
    label: 'Kansas',
    value: 'KS',
    key: 'KS',
  },
  { label: 'Kentucky', value: 'KY', key: 'KY' },
  {
    label: 'Louisiana',
    value: 'LA',
    key: 'LA',
  },
  { label: 'Maine', value: 'ME', key: 'ME' },
  {
    label: 'Marshall Islands',
    value: 'MH',
    key: 'MH',
  },
  { label: 'Maryland', value: 'MD', key: 'MD' },
  {
    label: 'Massachusetts',
    value: 'MA',
    key: 'MA',
  },
  { label: 'Michigan', value: 'MI', key: 'MI' },
  {
    label: 'Minnesota',
    value: 'MN',
    key: 'MN',
  },
  { label: 'Mississippi', value: 'MS', key: 'MS' },
  {
    label: 'Missouri',
    value: 'MO',
    key: 'MO',
  },
  { label: 'Montana', value: 'MT', key: 'MT' },
  {
    label: 'Nebraska',
    value: 'NE',
    key: 'NE',
  },
  { label: 'Nevada', value: 'NV', key: 'NV' },
  {
    label: 'New Hampshire',
    value: 'NH',
    key: 'NH',
  },
  { label: 'New Jersey', value: 'NJ', key: 'NJ' },
  {
    label: 'New Mexico',
    value: 'NM',
    key: 'NM',
  },
  { label: 'New York', value: 'NY', key: 'NY' },
  {
    label: 'North Carolina',
    value: 'NC',
    key: 'NC',
  },
  { label: 'North Dakota', value: 'ND', key: 'ND' },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
    key: 'MP',
  },
  { label: 'Ohio', value: 'OH', key: 'OH' },
  {
    label: 'Oklahoma',
    value: 'OK',
    key: 'OK',
  },
  { label: 'Oregon', value: 'OR', key: 'OR' },
  {
    label: 'Palau',
    value: 'PW',
    key: 'PW',
  },
  { label: 'Pennsylvania', value: 'PA', key: 'PA' },
  {
    label: 'Puerto Rico',
    value: 'PR',
    key: 'PR',
  },
  { label: 'Rhode Island', value: 'RI', key: 'RI' },
  {
    label: 'South Carolina',
    value: 'SC',
    key: 'SC',
  },
  { label: 'South Dakota', value: 'SD', key: 'SD' },
  {
    label: 'Tennessee',
    value: 'TN',
    key: 'TN',
  },
  { label: 'Texas', value: 'TX', key: 'TX' },
  {
    label: 'Utah',
    value: 'UT',
    key: 'UT',
  },
  { label: 'Vermont', value: 'VT', key: 'VT' },
  {
    label: 'Virgin Islands',
    value: 'VI',
    key: 'VI',
  },
  { label: 'Virginia', value: 'VA', key: 'VA' },
  {
    label: 'Washington',
    value: 'WA',
    key: 'WA',
  },
  { label: 'West Virginia', value: 'WV', key: 'WV' },
  {
    label: 'Wisconsin',
    value: 'WI',
    key: 'WI',
  },
  { label: 'Wyoming', value: 'WY', key: 'WY' },
];

export const OPTIONS_COMMON_MARKS: {
  value: number;
  label?: ReactNode;
}[] = [
  { label: '0', value: 0 },
  { label: '', value: 1 },
  { label: '', value: 2 },
  { label: '', value: 3 },
  { label: '', value: 4 },
  { label: '5', value: 5 },
  { label: '', value: 6 },
  { label: '', value: 7 },
  { label: '', value: 8 },
  { label: '', value: 9 },
  { label: '10', value: 10 },
  { label: '', value: 11 },
  { label: '', value: 12 },
  { label: '', value: 13 },
  { label: '', value: 14 },
  { label: '15', value: 15 },
  { label: '', value: 16 },
  { label: '', value: 17 },
  { label: '', value: 18 },
  { label: '', value: 19 },
  { label: '20+', value: 20 },
];
export const OPTIONS_COMMON_APPRAISAL_STAGE: Option[] = [
  {
    label: 'Not started',
    value: AppraisalStage.NotStarted,
    key: AppraisalStage.NotStarted,
  },
  {
    label: 'Paid for',
    value: AppraisalStage.PaidFor,
    key: AppraisalStage.PaidFor,
  },
  {
    label: 'Canceled',
    value: AppraisalStage.Canceled,
    key: AppraisalStage.Canceled,
  },
  {
    label: 'Ordered',
    value: AppraisalStage.Ordered,
    key: AppraisalStage.Ordered,
  },
  {
    label: 'Scheduled',
    value: AppraisalStage.Scheduled,
    key: AppraisalStage.Scheduled,
  },
  {
    label: 'Completed',
    value: AppraisalStage.Completed,
    key: AppraisalStage.Completed,
  },
];
