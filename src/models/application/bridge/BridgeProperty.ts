import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Options } from '@/types/options';

export const BridgeProperty = types
  .model({
    values: types.model({
      propertyType: types.union(
        types.literal(Options.PropertyOpt.default),
        types.literal(Options.PropertyOpt.singleFamily),
        types.literal(Options.PropertyOpt.townhouse),
        types.literal(Options.PropertyOpt.condo),
        types.literal(Options.PropertyOpt.twoToFourFamily),
      ),
      propertyUnit: types.union(
        types.literal(Options.PropertyUnitOpt.default),
        types.literal(Options.PropertyUnitOpt.twoUnits),
        types.literal(Options.PropertyUnitOpt.threeUnits),
        types.literal(Options.PropertyUnitOpt.fourUnits),
      ),
      isConfirm: types.maybe(types.boolean),
    }),
  })
  .views((self) => ({
    get checkIsValid() {
      const { isConfirm, propertyType, propertyUnit } = self.values;
      if (!isConfirm || !propertyType) {
        return false;
      }
      if (propertyType === Options.PropertyOpt.twoToFourFamily) {
        return !!isConfirm && !!propertyUnit;
      }
      return !!isConfirm && !!propertyType;
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

export type IBridgeProperty = Instance<typeof BridgeProperty>;
export type SBridgeProperty = SnapshotOut<typeof BridgeProperty>;
