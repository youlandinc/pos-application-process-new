import { types } from 'mobx-state-tree';
import {
  IntendedUseEnum,
  LandReadinessFormData,
  LoanAnswerEnum,
} from '@/types';

export const LandReadiness = types
  .model({
    intendedUse: types.enumeration(Object.values(IntendedUseEnum)),
    hasObtained: types.enumeration(Object.values(LoanAnswerEnum)),
    hasCompleted: types.enumeration(Object.values(LoanAnswerEnum)),
    hasTimeline: types.enumeration(Object.values(LoanAnswerEnum)),
  })
  .actions((self) => {
    return {
      changeFieldValue<T extends keyof typeof self>(
        key: T,
        value: (typeof self)[T],
      ) {
        self[key] = value;
      },
      injectServerData(data: LandReadinessFormData) {
        const { intendedUse, hasObtained, hasCompleted, hasTimeline } = data;

        self.intendedUse = intendedUse ?? IntendedUseEnum.single_family;
        self.hasObtained = hasObtained ?? LoanAnswerEnum.yes;
        self.hasCompleted = hasCompleted ?? LoanAnswerEnum.yes;
        self.hasTimeline = hasTimeline ?? LoanAnswerEnum.yes;
      },
      getPostData() {
        return {
          intendedUse: self.intendedUse,
          hasObtained: self.hasObtained,
          hasCompleted: self.hasCompleted,
          hasTimeline: self.hasTimeline,
        };
      },
    };
  });
