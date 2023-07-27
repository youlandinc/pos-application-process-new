import {
  destroy,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';

import { OccupancyOpt, PropertyOpt, PropertyUnitOpt } from '@/types/options';

import validate from '@/constants/validate';
import { PropertySchema } from '@/constants';

export const MortgageRefinanceProperty = types
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
        types.literal(PropertyUnitOpt.twoUnits),
        types.literal(PropertyUnitOpt.threeUnits),
        types.literal(PropertyUnitOpt.fourUnits),
        types.literal(PropertyUnitOpt.default),
      ),
      homeValue: types.maybe(types.number),
      rentalIncome: types.maybe(types.number),
    }),
    errors: types.optional(
      types.model({
        occupancyOpt: types.maybe(types.array(types.string)),
        propertyOpt: types.maybe(types.array(types.string)),
        rentalIncome: types.maybe(types.array(types.string)),
        homeValue: types.maybe(types.array(types.string)),
      }),
      {},
    ),
    isValid: types.boolean,
  })
  .views((self) => ({
    get checkIsValid() {
      const { occupancyOpt, propertyOpt, numberOfUnits, homeValue } =
        self.values;
      const valid = Object.keys(self.errors).every(
        (key) => !self.errors[key as keyof typeof self.errors],
      );
      if (!homeValue || !occupancyOpt || !valid) {
        return false;
      }
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
    changeFieldValue<T extends keyof (typeof self)['values']>(
      key: T,
      value: (typeof self)['values'][T],
    ) {
      const errors = validate({ [key]: value }, { [key]: PropertySchema[key] });
      self.isValid = !errors;
      self.errors = { ...self.errors, ...(errors || {}) };
      if (self.errors[key as keyof typeof self.errors] && errors === void 0) {
        destroy(self.errors[key as keyof typeof self.errors]);
      }
      self.isValid = Object.keys(self.errors).length === 0;
      self.values[key] = value;
    },
    validateForm() {
      const errors = validate(self.values, PropertySchema);
      self.isValid = Object.keys(getSnapshot(self.errors)).every(
        (key) => !self.errors[key as keyof typeof self.errors],
      );
      self.errors = errors || {};
    },
    resetPartForm() {
      if (self.values.propertyOpt === PropertyOpt.twoToFourFamily) {
        return;
      }
      self.values.numberOfUnits = PropertyUnitOpt.default;
      if (!self.values.rentalIncome) {
        self.values.rentalIncome = 0;
      }
    },
    resetAllForm() {
      self.values.propertyOpt = PropertyOpt.default;
      self.values.numberOfUnits = PropertyUnitOpt.default;
      self.values.rentalIncome = 0;
    },
  }));

export type IMortgageRefinanceProperty = Instance<
  typeof MortgageRefinanceProperty
>;
export type SMortgageRefinanceProperty = SnapshotOut<
  typeof MortgageRefinanceProperty
>;
