export const AddressSchema: Record<any, any> = {
  address: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  state: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  postcode: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  city: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
};
