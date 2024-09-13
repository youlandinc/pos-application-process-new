import { DashboardTaskCitizenshipStatus } from '@/types';

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
  ssn: (value: any, attributes: any) => {
    if (
      attributes.citizenship !== DashboardTaskCitizenshipStatus.foreign_national
    ) {
      return {
        ssn: true,
      };
    }
    return undefined;
  },
};
