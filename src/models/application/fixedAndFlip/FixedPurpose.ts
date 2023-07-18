import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { Address } from '@/models/common/Address';

import { PropertyNumberOpt } from '@/types/options';

export const FixedPurpose = types
  .model({
    values: types.model({
      propertyNumber: types.union(
        types.literal(PropertyNumberOpt.default),
        types.literal(PropertyNumberOpt.zero),
        types.literal(PropertyNumberOpt.one_to_four),
        types.literal(PropertyNumberOpt.five_more),
      ),
      address: Address,
    }),
  })
  .views((self) => {
    return {
      get checkIsValid() {
        const { propertyNumber, address } = self.values;
        return propertyNumber && address.checkFuzzyAddress;
      },
    };
  })
  .actions((self) => {
    return {
      changeFieldValue<T extends keyof (typeof self)['values']>(
        key: T,
        value: (typeof self)['values'][T],
      ) {
        self.values[key] = value;
      },
    };
  });

export type IFixedPurpose = Instance<typeof FixedPurpose>;
export type SFixedPurpose = SnapshotOut<typeof FixedPurpose>;
