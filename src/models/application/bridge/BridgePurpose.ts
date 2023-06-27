import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { Address } from '@/models/common/Address';

import { BridgePropertyNumberOpt } from '@/types/options';

export const BridgePurpose = types
  .model({
    values: types.model({
      propertyNumber: types.union(
        types.literal(BridgePropertyNumberOpt.default),
        types.literal(BridgePropertyNumberOpt.zero),
        types.literal(BridgePropertyNumberOpt.one_to_four),
        types.literal(BridgePropertyNumberOpt.five_more),
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

export type IBridgePurpose = Instance<typeof BridgePurpose>;
export type SBridgePurpose = SnapshotOut<typeof BridgePurpose>;
