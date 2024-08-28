import { DashboardTaskBorrowerType } from '@/types';

export const TaskBorrowerSchema: Record<any, any> = {
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
  signatoryTitle: (value: any, attributes: any) => {
    if (attributes.borrowerType === DashboardTaskBorrowerType.individual) {
      return undefined;
    }
    return {
      presence: {
        allowEmpty: false,
        message: '^Cannot be empty',
      },
    };
  },
  // entity
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
  trustName: (value: any, attributes: any) => {
    if (
      [
        DashboardTaskBorrowerType.individual,
        DashboardTaskBorrowerType.entity,
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
