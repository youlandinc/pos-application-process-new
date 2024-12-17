import { AddressData } from '@/types';

export interface SubmitLeadFromData {
  addressInfo: AddressData;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  additionalInfo: string;
}
