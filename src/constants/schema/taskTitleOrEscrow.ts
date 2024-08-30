export const TaskTitleOrEscrowSchema = {
  contractFrom: {
    companyName: {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    },
    titleOrderNumber: {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    },
    contractDate: {
      date: {},
    },
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
      formEmail: {},
    },
  },
  manageForm: {
    companyName: {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    },
    titleOrderNumber: {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    },
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
      formEmail: {},
    },
  },
};
