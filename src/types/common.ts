import { User } from '@/types/user';
import { ReactNode } from 'react';

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
  lng?: number;
  lat?: number;
}

export type EstateAgent = User.BaseUserInfo;

export enum LoanAnswerEnum {
  default = '',
  yes = 'YES',
  no = 'NO',
  not_sure = 'NOT_SURE',
}

export enum PipelineLoanStageEnum {
  not_submitted = 'NOT_SUBMITTED',
  //scenario = submitted
  scenario = 'SCENARIO',
  initial_approval = 'INITIAL_APPROVAL',
  pre_approved = 'PRE_APPROVED',
  preparing_docs = 'PREPARING_DOCS',
  docs_out = 'DOCS_OUT',
  funded = 'FUNDED',
  rejected = 'REJECTED',
  inactive = 'INACTIVE',
}

export enum LayoutSceneTypeEnum {
  application = 'APPLICATION',
  account = 'ACCOUNT',
  dashboard = 'DASHBOARD',
  pipeline_without_all = 'PIPELINE_WITHOUT_ALL',
}

export interface MenuItems {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
}

export enum AppraisalStatusEnum {
  not_started = 'NOT_STARTED',
  paid_for = 'PAID_FOR',
  ordered = 'ORDERED',
  scheduled = 'SCHEDULED',
  canceled = 'CANCELED',
  completed = 'COMPLETED',
}
