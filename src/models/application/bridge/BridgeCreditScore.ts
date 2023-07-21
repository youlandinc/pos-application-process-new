import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { BridgeCoBorrowerCondition, VariableName } from '@/types';
import { PersonalInfo } from '@/models/application/common/CreditScore';

import { BridgeCreditScoreState } from '@/types/enum';

export const BridgeCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    coBorrowerCondition: types.model({
      isCoBorrower: types.maybe(types.boolean),
    }),
    coBorrowerInfo: PersonalInfo,
    state: types.frozen<BridgeCreditScoreState>(),
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
    injectServerData(value: BridgeCoBorrowerCondition) {
      const { isCoBorrower } = value;
      self.coBorrowerCondition.isCoBorrower = isCoBorrower;
    },
    getCoborrowerConditionPostData(): Variable<BridgeCoBorrowerCondition> {
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

export type IBridgeCreditScore = Instance<typeof BridgeCreditScore>;
export type SBridgeCreditScore = SnapshotOut<typeof BridgeCreditScore>;
