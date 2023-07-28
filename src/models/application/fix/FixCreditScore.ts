import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { FixCoBorrowerCondition, VariableName } from '@/types';
import { PersonalInfo } from '@/models/application/common/CreditScore';

import { FixAndFlipCreditScoreState } from '@/types/enum';

export const FixCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    coBorrowerCondition: types.model({
      isCoBorrower: types.maybe(types.boolean),
    }),
    coBorrowerInfo: PersonalInfo,
    state: types.frozen<FixAndFlipCreditScoreState>(),
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
    injectServerData(value: FixCoBorrowerCondition) {
      const { isCoBorrower } = value;
      self.coBorrowerCondition.isCoBorrower = isCoBorrower;
    },
    getCoborrowerConditionPostData(): Variable<FixCoBorrowerCondition> {
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

export type IFixCreditScore = Instance<typeof FixCreditScore>;
export type SFixCreditScore = SnapshotOut<typeof FixCreditScore>;
