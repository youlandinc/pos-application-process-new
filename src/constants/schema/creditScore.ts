export const CreditScoreSchema: Record<any, any> = {
  selfInfo: {
    firstName: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    lastName: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    phoneNumber: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
      AmericanPhoneNumber: {},
    },
    dateOfBirth: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
      date: {
        minAge: 18,
        message: '^Borrowers must not be less than 18 years old',
      },
    },
    ssn: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
      ssn: true,
    },
    email: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
  },
};
