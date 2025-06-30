import {
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
} from '@/types';

export const TaskBorrowerIndividual: Record<any, any> = {
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
  birthDate: {
    date: {
      minAge: 18,
    },
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

export const TaskBorrowerEntity: Record<any, any> = {
  phoneNumber: {
    AmericanPhoneNumber: {},
  },
  email: {
    formEmail: {},
  },
  entityName: (value: any, attributes: any) => {
    if (
      [
        DashboardTaskBorrowerType.individual,
        DashboardTaskBorrowerType.trust,
      ].includes(attributes.borrowerType)
    ) {
      return undefined;
    }
    return {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    };
  },
  entityType: (value: any, attributes: any) => {
    if (
      [
        DashboardTaskBorrowerType.individual,
        DashboardTaskBorrowerType.trust,
      ].includes(attributes.borrowerType)
    ) {
      return undefined;
    }
    return {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    };
  },
  entityState: (value: any, attributes: any) => {
    if (
      [
        DashboardTaskBorrowerType.individual,
        DashboardTaskBorrowerType.trust,
      ].includes(attributes.borrowerType)
    ) {
      return undefined;
    }
    return {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    };
  },
  entityId: (value: any, attributes: any) => {
    if (
      [
        DashboardTaskBorrowerType.individual,
        DashboardTaskBorrowerType.trust,
      ].includes(attributes.borrowerType)
    ) {
      return undefined;
    }
    return {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    };
  },
};

export const TaskBorrowerTrust: Record<any, any> = {
  trustName: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
};

export const TaskBorrowerSignatory: Record<any, any> = {
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
  signatoryTitle: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
  birthday: {
    date: {
      minAge: 18,
    },
  },
  phoneNumber: {
    AmericanPhoneNumber: {},
  },
  email: {
    formEmail: {},
  },
  citizenship: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
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
  maritalStatus: {
    presence: {
      allowEmpty: false,
      message: '^Cannot be empty',
    },
  },
};
