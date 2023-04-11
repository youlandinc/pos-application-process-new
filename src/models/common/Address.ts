import { destroy, Instance, SnapshotOut, types } from 'mobx-state-tree';
import validate from 'validate.js';
import { AddressData } from '@/types';
import { PurposeSchema } from '@/constants';

type AddressError = AddressData;

export const Address = types
  .model({
    formatAddress: types.string,
    state: types.string,
    street: types.string,
    aptNumber: types.string,
    city: types.string,
    postcode: types.string,
    errors: types.frozen<AddressError>(),
    isValid: types.boolean,
  })
  .views((self) => ({
    get checkAddressValid() {
      return !!self.formatAddress && !!self.state && self.postcode.length === 5;
    },
    get checkFuzzyAddress() {
      return !!self.state && self.postcode.length === 5;
    },
    get checkRefinanceValid() {
      return (
        !!self.state &&
        !!self.formatAddress &&
        !!self.city &&
        !!self.postcode &&
        self.postcode.length === 5
      );
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      const errors = validate({ [key]: value }, { [key]: PurposeSchema[key] });
      self.errors = { ...self.errors, ...(errors || {}) };
      if (self.errors[key as keyof typeof self.errors] && errors === void 0) {
        destroy(self.errors[key as keyof typeof self.errors]);
      }
      self.isValid = Object.keys(self.errors).length === 0;
      self[key] = value;
    },
    validateForm() {
      const errors = validate(self, PurposeSchema);
      self.isValid = !errors;
      self.errors = errors || {};
    },
    injectServerData(value: AddressData) {
      const { address, aptNumber, city, state, postcode } = value;
      self.formatAddress = address;
      self.aptNumber = aptNumber;
      self.city = city;
      self.state = state;
      self.postcode = postcode;
      self.isValid = Object.keys(self).some((item) => item);
    },
    getPostData(): AddressData {
      const { formatAddress: address, aptNumber, city, state, postcode } = self;
      return {
        address,
        aptNumber,
        city,
        state,
        postcode,
      };
    },

    reset(): void {
      self.formatAddress = '';
      self.state = '';
      self.street = '';
      self.aptNumber = '';
      self.city = '';
      self.postcode = '';
      self.errors = {} as AddressError;
      self.isValid = false;
    },
  }));

export type IAddress = Instance<typeof Address>;
export type SAddress = SnapshotOut<typeof Address>;
