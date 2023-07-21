import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { GroundCoBorrowerCondition, VariableName } from '@/types';
import { PersonalInfo } from '@/models/application/common/CreditScore';

import { GroundUpConstructionCreditScoreState } from '@/types/enum';

export const GroundCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    coBorrowerCondition: types.model({
      isCoBorrower: types.maybe(types.boolean),
    }),
    coBorrowerInfo: PersonalInfo,
    state: types.frozen<GroundUpConstructionCreditScoreState>(),
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
    injectServerData(value: GroundCoBorrowerCondition) {
      const { isCoBorrower } = value;
      self.coBorrowerCondition.isCoBorrower = isCoBorrower;
    },
    getCoborrowerConditionPostData(): Variable<GroundCoBorrowerCondition> {
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

export type IGroundCreditScore = Instance<typeof GroundCreditScore>;
export type SGroundCreditScore = SnapshotOut<typeof GroundCreditScore>;
