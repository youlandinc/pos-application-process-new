export const PropertySchema: Record<any, any> = {
  occupancyOpt: {
    presence: {
      allowEmpty: false,
      message: 'Must not be empty',
    },
  },
  propertyOpt: {
    presence: {
      allowEmpty: false,
      message: 'Must not be empty',
    },
  },
  rentalIncome: {
    presence: {
      allowEmpty: false,
      message: 'Must not be empty',
    },
    numericality: {
      lessThanOrEqualTo: 100000000,
      greaterThanOrEqualTo: 0,
      NotLessThanOrEqualTo: 'rental income must not be greater than 100000000',
      NotGreaterThanOrEqualTo: 'rental income must not be less than 0',
    },
  },
  numberOfUnits: {
    optional: {
      parentsConditions: {
        propertyOpt: 'TWO_TO_FOUR_FAMILY',
      },
      required: true,
    },
  },
  // refinance
  homeValue: {
    presence: {
      allowEmpty: false,
      message: 'Must not be empty',
    },
    numericality: {
      lessThanOrEqualTo: 100000000,
      greaterThanOrEqualTo: 50000,
      NotLessThanOrEqualTo: 'home value must not be greater than 100000000',
      NotGreaterThanOrEqualTo: 'home value must not be less than 0',
    },
  },
};
