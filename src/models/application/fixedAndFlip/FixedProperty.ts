import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { PropertyOpt, PropertyUnitOpt } from '@/types/options';

export const FixedProperty = types
  .model({
    values: types.model({
      propertyType: types.union(
        types.literal(PropertyOpt.default),
        types.literal(PropertyOpt.singleFamily),
        types.literal(PropertyOpt.townhouse),
        types.literal(PropertyOpt.condo),
        types.literal(PropertyOpt.twoToFourFamily),
      ),
      propertyUnit: types.union(
        types.literal(PropertyUnitOpt.default),
        types.literal(PropertyUnitOpt.twoUnits),
        types.literal(PropertyUnitOpt.threeUnits),
        types.literal(PropertyUnitOpt.fourUnits),
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
      if (propertyType === PropertyOpt.twoToFourFamily) {
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

export type IFixedProperty = Instance<typeof FixedProperty>;
export type SFixedProperty = SnapshotOut<typeof FixedProperty>;
