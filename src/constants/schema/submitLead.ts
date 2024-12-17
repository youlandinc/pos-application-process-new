export const SubmitLeadSchema: Record<any, any> = {
  firstName: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  phoneNumber: {
    AmericanPhoneNumber: {},
  },
  email: {
    email: true,
  },
};
