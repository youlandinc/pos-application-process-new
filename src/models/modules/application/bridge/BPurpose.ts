import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BPropNumOpt } from '@/types/options';
import { Address } from '@/models/modules';

export const BPurpose = types
  .model({
    values: types.model({
      propertyNumber: types.union(
        types.literal(BPropNumOpt.default),
        types.literal(BPropNumOpt.zero),
        types.literal(BPropNumOpt.one_to_four),
        types.literal(BPropNumOpt.five_more),
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
      changeFieldValue<T extends keyof typeof self['values']>(
        key: T,
        value: typeof self['values'][T],
      ) {
        self['values'][key] = value;
      },
    };
  });

export type IBPurpose = Instance<typeof BPurpose>;
export type SBPurpose = SnapshotOut<typeof BPurpose>;
