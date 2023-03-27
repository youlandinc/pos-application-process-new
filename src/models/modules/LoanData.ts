import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const LoanData = types.model({
  caption: types.maybe(types.string),
  balance: types.maybe(types.number),
  payment: types.maybe(types.number),
  isPrimary: types.maybe(types.boolean),
  includedTaxAndIns: types.maybe(types.boolean),
});

export type ILoanData = Instance<typeof LoanData>;
export type SLoanData = SnapshotOut<typeof LoanData>;
