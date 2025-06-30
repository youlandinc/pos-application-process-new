import { DBorrowerSignatoryInfo } from '@/types/dashboard/DBorrower';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import {
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanMarriedStatusEnum,
} from '@/types';

import { Address } from '@/models/common/Address';

export const DSignatoryInfo = types
  .model({
    id: types.string,
    firstName: types.string,
    lastName: types.string,
    signatoryTitle: types.string,
    birthday: types.maybeNull(types.string),
    phoneNumber: types.string,
    email: types.string,
    citizenship: types.union(
      types.enumeration(Object.values(LoanCitizenshipEnum)),
      types.string,
    ),
    ssn: types.string,
    maritalStatus: types.union(
      types.enumeration(Object.values(LoanMarriedStatusEnum)),
      types.string,
    ),
    addressInfo: Address,
    marriedTogether: types.union(
      types.enumeration(Object.values(LoanAnswerEnum)),
      types.string,
    ),
    errors: types.optional(
      types.frozen<
        Record<string, string[]> & {
          addressInfo?: Record<string, string[]> | undefined;
        }
      >(),
      () => ({}),
    ),
  })
  .actions((self) => ({
    changeError(
      key: keyof DBorrowerSignatoryInfo,
      value: string[] | undefined,
    ) {
      const newErrors = { ...self.errors };
      if (value && value.length > 0) {
        newErrors[key as string] = value;
      } else {
        delete newErrors[key as string];
      }
      self.errors = newErrors;
    },
    removeError(key: keyof DBorrowerSignatoryInfo) {
      const newErrors = { ...self.errors };
      delete newErrors[key as string];
      self.errors = newErrors;
    },
  }));

export type IDSignatoryInfo = Instance<typeof DSignatoryInfo>;
export type SDSignatoryInfo = SnapshotOut<typeof DSignatoryInfo>;
