import { DashboardTaskCitizenshipStatus } from '@/types';

export const CreditScoreSchema: Record<any, any> = {
  selfInfo: {
    citizenship: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
    },
    firstName: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
    },
    lastName: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
    },
    phoneNumber: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
      AmericanPhoneNumber: {},
    },
    dateOfBirth: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
      date: {
        minAge: 18,
        message: '^Borrower must be at least 18 years old',
      },
    },
    email: {
      presence: {
        allowEmpty: false,
        message: '^Must not be empty',
      },
    },
    ssn: (value: any, attributes: any) => {
      if (
        attributes.citizenship !==
        DashboardTaskCitizenshipStatus.foreign_national
      ) {
        return {
          presence: {
            allowEmpty: false,
            message: '^Must not be empty',
          },
          ssn: true,
        };
      }
      return undefined;
    },
    inputCreditScore: (value: any, attributes: any) => {
      if (attributes.isSkipCheck) {
        return {
          presence: {
            allowEmpty: false,
            message: '^Must not be empty',
          },
          numericality: {
            lessThanOrEqualTo: 850,
            greaterThanOrEqualTo: 300,
            message: '^The score must be between 300 and 850.',
          },
        };
      }
      return undefined;
    },
  },
};
