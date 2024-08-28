export const TaskCoBorrowerSchema: Record<any, any> = {
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
  birthDate: {
    date: {
      minAge: 18,
    },
  },
  email: {
    formEmail: {},
  },
  ssn: {
    ssn: true,
  },
};
