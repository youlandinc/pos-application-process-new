import { types } from 'mobx-state-tree';
import { Address } from '@/models/common/Address';
import { SubmitLeadFromData } from '@/types';

export const SubmitLead = types
  .model({
    addressInfo: Address,
    firstName: types.string,
    lastName: types.string,
    email: types.string,
    phoneNumber: types.string,
    additionalInfo: types.string,
  })
  .views((self) => ({
    isEmpty() {
      const { firstName, lastName, email, phoneNumber, addressInfo } = self;

      return (
        !firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !addressInfo.checkAddressValid
      );
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      self[key] = value;
    },
    injectServerData(data: SubmitLeadFromData) {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        additionalInfo,
        addressInfo,
      } = data;

      self.firstName = firstName;
      self.lastName = lastName;
      self.email = email;
      self.phoneNumber = phoneNumber;
      self.additionalInfo = additionalInfo;
      self.addressInfo.injectServerData(addressInfo);
    },
    getPostData() {
      return {
        firstName: self.firstName,
        lastName: self.lastName,
        email: self.email,
        phoneNumber: self.phoneNumber,
        additionalInfo: self.additionalInfo,
        addressInfo: self.addressInfo.getPostData(),
      };
    },
  }));
