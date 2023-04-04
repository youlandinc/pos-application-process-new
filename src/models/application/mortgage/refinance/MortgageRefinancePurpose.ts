import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/base';

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

export type IMortgageRefinancePurpose = Instance<
  typeof MortgageRefinancePurpose
>;
export type SMortgageRefinancePurpose = SnapshotOut<
  typeof MortgageRefinancePurpose
>;
