import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BREstimateRateData } from '@/types/application/bridge';

import { VariableName } from '@/types/enum';

export const BREstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
    homeValue: types.maybe(types.number),
    balance: types.maybe(types.number),
    isCashOut: types.maybe(types.boolean),
    cashOutAmount: types.maybe(types.number),
    customRate: types.maybe(types.boolean),
    loanTerm: types.maybe(types.number),
    interestRate: types.maybe(types.number),
  })
  .views(() => ({
    get checkIsValid() {
      return true;
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      self[key] = value;
    },
    getPostData(): Variable<BREstimateRateData> {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        closeDate,
        customRate,
        loanTerm,
        interestRate,
      } = self;

      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          homeValue,
          balance,
          isCashOut: isCashOut as boolean,
          cashOutAmount,
          closeDate,
          customRate,
          loanTerm,
          interestRate,
        },
      };
    },
    injectModifyData(value: any) {
      self.homeValue = value.homeValue;
      self.isCashOut = value.isCashOut;
      self.cashOutAmount = value.cashOutAmount;
      self.balance = value.balance;
    },
    injectServerData(value: BREstimateRateData) {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        closeDate,
        customRate,
        loanTerm,
        interestRate,
      } = value;

      self.homeValue = homeValue;
      self.balance = balance;
      self.isCashOut = isCashOut;
      self.cashOutAmount = cashOutAmount;
      self.closeDate = closeDate as unknown as null;
      self.customRate = customRate;
      self.loanTerm = loanTerm;
      self.interestRate = interestRate;
    },
  }));

export type IBREstimateRate = Instance<typeof BREstimateRate>;
export type SBREstimateRate = SnapshotOut<typeof BREstimateRate>;
