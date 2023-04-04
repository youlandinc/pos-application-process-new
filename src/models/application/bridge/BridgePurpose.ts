import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/base';
import { Options } from '@/types/options';

export const BridgePurpose = types
  .model({
    values: types.model({
      propertyNumber: types.union(
        types.literal(Options.BridgePropertyNumberOpt.default),
        types.literal(Options.BridgePropertyNumberOpt.zero),
        types.literal(Options.BridgePropertyNumberOpt.one_to_four),
        types.literal(Options.BridgePropertyNumberOpt.five_more),
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
