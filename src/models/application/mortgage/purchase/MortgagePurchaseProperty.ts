import { destroy, Instance, SnapshotOut, types } from 'mobx-state-tree';
import validate from '@/constants/validate';
import { PropertySchema } from '@/constants';
import { Options } from '@/types/options';

export const MortgagePurchaseProperty = types
  .model({
    values: types.model({
      occupancyOpt: types.union(
        types.literal(Options.OccupancyOpt.primaryResidence),
        types.literal(Options.OccupancyOpt.secondHome),
        types.literal(Options.OccupancyOpt.investmentProperty),
        types.literal(Options.OccupancyOpt.default),
      ),
      propertyOpt: types.union(
        types.literal(Options.PropertyOpt.singleFamily),
        types.literal(Options.PropertyOpt.townhouse),
        types.literal(Options.PropertyOpt.condo),
        types.literal(Options.PropertyOpt.twoToFourFamily),
        types.literal(Options.PropertyOpt.default),
      ),
      numberOfUnits: types.union(
        types.literal(Options.PropertyUnitOpt.twoUnits),
        types.literal(Options.PropertyUnitOpt.threeUnits),
        types.literal(Options.PropertyUnitOpt.fourUnits),
        types.literal(Options.PropertyUnitOpt.default),
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
      if (!occupancyOpt) {
        return false;
      }
      if (occupancyOpt === Options.OccupancyOpt.investmentProperty) {
        return propertyOpt === Options.PropertyOpt.twoToFourFamily
          ? !!numberOfUnits
          : !!propertyOpt;
      }
      return propertyOpt === Options.PropertyOpt.twoToFourFamily
        ? !!numberOfUnits
        : !!propertyOpt;
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof (typeof self)['values']>(
      key: T,
      value: (typeof self)['values'][T],
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
      if (self.values.propertyOpt === Options.PropertyOpt.twoToFourFamily) {
        return;
      }
      self.values.numberOfUnits = Options.PropertyUnitOpt.default;
      if (!self.values.rentalIncome) {
        self.values.rentalIncome = undefined;
      }
    },
    resetAllForm() {
      self.values.propertyOpt = Options.PropertyOpt.default;
      self.values.numberOfUnits = Options.PropertyUnitOpt.default;
      self.values.rentalIncome = undefined;
    },
  }));

export type IMortgagePurchaseProperty = Instance<
  typeof MortgagePurchaseProperty
>;
export type SMortgagePurchaseProperty = SnapshotOut<
  typeof MortgagePurchaseProperty
>;
