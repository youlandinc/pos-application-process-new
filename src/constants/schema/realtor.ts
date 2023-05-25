export const RealtorSchema: Record<any, any> = {
  firstName: {
    presence: {
      allowEmpty: false,
      message: '^First name must not be empty',
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: '^Last name must not be empty',
    },
  },
  phoneNumber: {
    presence: {
      allowEmpty: false,
      message: '^Phone number must not be empty',
    },
    AmericanPhoneNumber: {},
  },
  email: {
    presence: {
      allowEmpty: false,
      message: '^Email must not be empty',
    },
    email: true,
  },
};
