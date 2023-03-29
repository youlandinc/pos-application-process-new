import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { DTIState } from '@/types/enum';

export const MortgagePurchaseDTI = types
  .model({
    dti: types.number,
    dtiMaxAcceptable: types.number,
    reconciled: types.boolean,
    state: types.frozen<DTIState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self['state']) {
      self.state = state;
    },
    setReconciled(reconciled: boolean) {
      self.reconciled = reconciled;
    },
  }));

export type IMPDTI = Instance<typeof MortgagePurchaseDTI>;
export type SMPDTI = SnapshotOut<typeof MortgagePurchaseDTI>;
