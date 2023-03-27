import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { PersonalInfo } from '@/models/modules';
import { BridgeCreditScoreState } from '@/types/enum';

export const BCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    state: types.frozen<BridgeCreditScoreState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self['state']) {
      self.state = state;
    },
  }));

export type IBCreditScore = Instance<typeof BCreditScore>;
export type SBCreditScore = SnapshotOut<typeof BCreditScore>;
