import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BridgeRefinanceEstimateRateData } from '@/types/application/bridge';

import { VariableName } from '@/types/enum';

export const BREstimateRate = types
  .model({
    homeValue: types.maybe(types.number),
    balance: types.maybe(types.number),
    isCashOut: types.maybe(types.boolean),
    cashOutAmount: types.maybe(types.number),
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
    getPostData(): Variable<BridgeRefinanceEstimateRateData> {
      const { homeValue, balance, isCashOut, cashOutAmount } = self;

      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          homeValue,
          balance,
          isCashOut: isCashOut as boolean,
          cashOutAmount,
        },
      };
    },
    injectServerData(value: BridgeRefinanceEstimateRateData) {
      const { homeValue, balance, isCashOut, cashOutAmount } = value;

      self.homeValue = homeValue;
      self.balance = balance;
      self.isCashOut = isCashOut;
      self.cashOutAmount = cashOutAmount;
    },
  }));

export type IBREstimateRate = Instance<typeof BREstimateRate>;
export type SBREstimateRate = SnapshotOut<typeof BREstimateRate>;
