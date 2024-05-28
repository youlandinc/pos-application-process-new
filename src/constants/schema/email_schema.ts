export const EmailSchema = {
  email: {
    presence: {
      allowEmpty: false,
      message: 'can not be empty',
    },
    format: {
      pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
      message: 'format is incorrect',
    },
    email: true,
  },
  phone: {
    AmericanPhoneNumber: {},
  },
};
