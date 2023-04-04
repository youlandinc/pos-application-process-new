import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Options } from '@/types/options';

export const TimeUnit = types.frozen<TimeUnit>();

export const DebtData = types
  .model({
    id: types.string,
    balance: types.maybe(types.number),
    payment: types.maybe(types.number),
    paymentSchedule: TimeUnit,
    receiver: types.maybe(types.string),
    disabled: types.maybe(types.boolean),
    canPayoff: types.maybe(types.boolean),
    consolidate: types.maybe(types.boolean),
    wrongReason: types.maybe(
      types.union(
        types.literal(Options.DebtWrongReasonOpt.default),
        types.literal(Options.DebtWrongReasonOpt.had_paid),
        types.literal(Options.DebtWrongReasonOpt.co_signer_pays),
        types.literal(Options.DebtWrongReasonOpt.employer_pays),
      ),
    ),
  })
  .actions((self) => {
    return {
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
    };
  });

export type IDebtData = Instance<typeof DebtData>;
export type SDebtData = SnapshotOut<typeof DebtData>;
