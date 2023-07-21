import { CommonBorrowerType } from '@/types';

export const CreditScoreSchema: Record<any, any> = {
  selfInfo: {
    citizenship: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
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
        message: 'Borrowers must not be less than 18 years old',
      },
    },
    email: {
      presence: {
        allowEmpty: false,
        message: 'Must not be empty',
      },
    },
    ssn: (value: any, attributes: any) => {
      if (attributes.citizenship !== CommonBorrowerType.foreign_national) {
        return {
          presence: {
            allowEmpty: false,
            message: 'Must not be empty',
          },
          ssn: true,
        };
      }
      return undefined;
    },
  },
};
