import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { FixedCoBorrowerCondition, VariableName } from '@/types';
import { PersonalInfo } from '@/models/application/common/CreditScore';

import { FixedAndFlipCreditScoreState } from '@/types/enum';

export const FixedCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    coBorrowerCondition: types.model({
      isCoBorrower: types.maybe(types.boolean),
    }),
    coBorrowerInfo: PersonalInfo,
    state: types.frozen<FixedAndFlipCreditScoreState>(),
  })
  .actions((self) => ({
    changeState(state: (typeof self)['state']) {
      self.state = state;
    },
    changeCoBorrowerCondition<
      K extends keyof (typeof self)['coBorrowerCondition'],
    >(key: K, value: (typeof self)['coBorrowerCondition'][K]) {
      self.coBorrowerCondition[key] = value;
    },
    injectServerData(value: FixedCoBorrowerCondition) {
      const { isCoBorrower } = value;
      self.coBorrowerCondition.isCoBorrower = isCoBorrower;
    },
    getCoborrowerConditionPostData(): Variable<FixedCoBorrowerCondition> {
      const { isCoBorrower } = self.coBorrowerCondition;
      return {
        name: VariableName.aboutOtherCondition,
        type: 'json',
        value: {
          isCoBorrower,
        },
      };
    },
  }));

export type IFixedCreditScore = Instance<typeof FixedCreditScore>;
export type SFixedCreditScore = SnapshotOut<typeof FixedCreditScore>;
