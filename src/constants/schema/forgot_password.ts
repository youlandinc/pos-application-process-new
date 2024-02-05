export const ForgotPasswordSchema = {
  verificationCode: {
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
      maximum: 30,
      tooShort: 'is too short',
      tooLong: 'is too long',
    },
    email: {
      message: "doesn't look like a valid email",
    },
  },
  confirmedPassword: {
    equality: {
      attribute: 'password',
      message: '^Passwords do not match',
      comparator: function (v1: string, v2: string) {
        return v1 === v2;
      },
    },
  },
};
