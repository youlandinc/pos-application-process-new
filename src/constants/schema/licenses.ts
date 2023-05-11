export const LicenseSchema: Record<any, any> = {
  selfInfo: {
    ownerName: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    state: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    licenseType: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    dateOfBirth: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
      date: {
        minAge: 18,
        message: 'Borrowers must not be less than 18 years old',
      },
    },
    ssn: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
      ssn: true,
    },
    license: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
  },
};
