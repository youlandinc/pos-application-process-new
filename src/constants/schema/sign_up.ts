export const SignUpSchema = {
  userType: {
    presence: {
      allowEmpty: false,
      message: 'can not be empty',
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: 'can not be empty',
    },
    length: {
      minimu: 3,
      maximum: 320,
      tooShort: 'is too short',
      tooLong: 'is too long',
    },
    email: {
      message: "doesn't look like a valid email",
    },
  },
  phone: {
    AmericanPhoneNumber: {},
  },
  confirmedPassword: {
    equality: {
      attribute: 'password',
      message: 'is not same',
      comparator: function (v1: string, v2: string) {
        return v1 === v2;
      },
    },
  },
};
