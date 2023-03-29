import validate from '@/common/validate';
import { OccupancyOpt, PropertyOpt, UnitOpt } from '@/types/options';
import { PropertySchema } from '@/common/schema';
import { destroy, Instance, SnapshotOut, types } from 'mobx-state-tree';

export const MortgagePurchaseProperty = types
  .model({
    values: types.model({
      occupancyOpt: types.union(
        types.literal(OccupancyOpt.primaryResidence),
        types.literal(OccupancyOpt.secondHome),
        types.literal(OccupancyOpt.investmentProperty),
        types.literal(OccupancyOpt.default),
      ),
      propertyOpt: types.union(
        types.literal(PropertyOpt.singleFamily),
        types.literal(PropertyOpt.townhouse),
        types.literal(PropertyOpt.condo),
        types.literal(PropertyOpt.twoToFourFamily),
        types.literal(PropertyOpt.default),
      ),
      numberOfUnits: types.union(
        types.literal(UnitOpt.twoUnits),
        types.literal(UnitOpt.threeUnits),
        types.literal(UnitOpt.fourUnits),
        types.literal(UnitOpt.default),
      ),
      rentalIncome: types.maybe(types.number),
    }),
    errors: types.optional(
      types.model({
        occupancyOpt: types.maybe(types.array(types.string)),
        propertyOpt: types.maybe(types.array(types.string)),
        rentalIncome: types.maybe(types.array(types.string)),
      }),
      {},
    ),
    isValid: types.boolean,
  })
  .views((self) => ({
    get checkIsValid() {
      const { occupancyOpt, propertyOpt, numberOfUnits } = self.values;
      if (!occupancyOpt) {return false;}
      if (occupancyOpt === OccupancyOpt.investmentProperty) {
        return propertyOpt === PropertyOpt.twoToFourFamily
          ? !!numberOfUnits
          : !!propertyOpt;
      } 
        return propertyOpt === PropertyOpt.twoToFourFamily
          ? !!numberOfUnits
          : !!propertyOpt;
      
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self['values']>(
      key: T,
      value: typeof self['values'][T],
    ) {
      const errors = validate({ [key]: value }, { [key]: PropertySchema[key] });
      self.isValid = !errors;
      self.errors = { ...self.errors, ...(errors || {}) };
      if (self.errors[key as unknown as any] && errors === void 0) {
        destroy(self.errors[key as unknown as any]);
      }
      self.isValid = Object.keys(self.errors).length === 0;
      self.values[key] = value;
    },
    validateForm() {
      const errors = validate(self.values, PropertySchema);
      self.isValid = !errors;
      self.errors = errors || {};
    },
    resetPartForm() {
      if (self.values.propertyOpt === PropertyOpt.twoToFourFamily) {return;}
      self.values.numberOfUnits = UnitOpt.default;
      if (!self.values.rentalIncome) {
        self.values.rentalIncome = undefined;
      }
    },
    resetAllForm() {
      self.values.propertyOpt = PropertyOpt.default;
      self.values.numberOfUnits = UnitOpt.default;
      self.values.rentalIncome = undefined;
    },
  }));

export type IMPProperty = Instance<typeof MortgagePurchaseProperty>;
export type SMPProperty = SnapshotOut<typeof MortgagePurchaseProperty>;
