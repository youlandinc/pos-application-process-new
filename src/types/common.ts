import { User } from '@/types/user';

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
}

export type EstateAgent = User.BaseUserInfo;

export enum LoanAnswerEnum {
  default = '',
  yes = 'YES',
  no = 'NO',
  not_sure = 'NOT_SURE',
}
