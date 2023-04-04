import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { PersonalInfo } from '@/models/application';
import { BridgeCreditScoreState } from '@/types/enum';

export const BridgeCreditScore = types
  .model({
    selfInfo: PersonalInfo,
    state: types.frozen<BridgeCreditScoreState>(),
  })
  .actions((self) => ({
    changeState(state: (typeof self)['state']) {
      self.state = state;
    },
  }));

export type IBridgeCreditScore = Instance<typeof BridgeCreditScore>;
export type SBridgeCreditScore = SnapshotOut<typeof BridgeCreditScore>;
