import { Address } from '@/models/modules';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const MortgageRefinancePurpose = types
  .model({
    values: types.model({
      address: Address,
    }),
  })
  .views((self) => ({
    get checkIsValid() {
      return self.values.address.checkRefinanceValid;
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof (typeof self)['values']>(
      key: T,
      value: (typeof self)['values'][T],
    ) {
      self.values[key] = value;
    },
  }));

export type IMRPurpose = Instance<typeof MortgageRefinancePurpose>;
export type SMRPurpose = SnapshotOut<typeof MortgageRefinancePurpose>;
