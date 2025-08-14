import { cast, Instance, SnapshotOut, types } from 'mobx-state-tree';
import _uniqueId from 'lodash/uniqueId';

import { Address } from '@/models/common/Address';

import { AddressData } from '@/types';

export const LoanAddress = types
  .compose(
    Address,
    types.model({
      editable: types.boolean,
      additionalAddress: types.array(Address),
    }),
  )
  .actions((self) => ({
    addAdditionalAddress() {
      const address = Address.create({
        id: _uniqueId('additional_address_'),
        formatAddress: '',
        state: '',
        street: '',
        aptNumber: '',
        city: '',
        postcode: '',
        lng: undefined,
        lat: undefined,
        errors: {},
        isValid: false,
      });
      self.additionalAddress.push(address);
    },
    removeAdditionalAddress(index: number) {
      self.additionalAddress.splice(index, 1);
    },
    injectAdditionalAddressServerData(data: {
      additionalAddress: AddressData[];
      editable: boolean;
    }) {
      const { additionalAddress = [], editable = true } = data;

      const list = additionalAddress.map((item) => {
        const { address, aptNumber, city, state, postcode, lng, lat } = item;

        return Address.create({
          id: _uniqueId('additional_address_'),
          formatAddress: address ?? '',
          state: state ?? '',
          street: '',
          aptNumber: aptNumber ?? '',
          city: city ?? '',
          postcode: postcode ?? '',
          lat: lat ?? void 0,
          lng: lng ?? void 0,
          isValid: Object.keys(item).some((v) => v),
          errors: {},
        });
      });

      self.editable = editable;
      self.additionalAddress = cast(list);
    },
    getLoanAddressPostData() {
      return {
        ...self.getPostData(),
        additionalAddress: self.additionalAddress.map((item) =>
          item.getPostData(),
        ),
      };
    },
  }));

export type ILoanAddress = Instance<typeof LoanAddress>;
export type SLoanAddress = SnapshotOut<typeof LoanAddress>;
