import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { GREstimateRateData } from '@/types/application/ground';

import { VariableName } from '@/types/enum';

export const GroundRefinanceEstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
    homeValue: types.maybe(types.number),
    balance: types.maybe(types.number),
    isCashOut: types.maybe(types.boolean),
    cashOutAmount: types.maybe(types.number),
    cor: types.maybe(types.number),
    arv: types.maybe(types.number),
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
    getPostData(): Variable<GREstimateRateData> {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        cor,
        arv,
        closeDate,
      } = self;

      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          homeValue,
          balance,
          isCashOut: isCashOut as boolean,
          cashOutAmount,
          cor,
          arv,
          closeDate,
        },
      };
    },
    injectModifyData(data: any) {
      self.homeValue = data.homeValue;
      self.balance = data.balance;
      self.isCashOut = data.isCashOut;
      self.cashOutAmount = data.cashOutAmount;
      self.cor = data.cor;
      self.arv = data.arv;
    },
    injectServerData(value: GREstimateRateData) {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        cor,
        arv,
        closeDate,
      } = value;

      self.homeValue = homeValue;
      self.balance = balance;
      self.isCashOut = isCashOut;
      self.cashOutAmount = cashOutAmount;
      self.cor = cor;
      self.arv = arv;
      self.closeDate = closeDate as unknown as null;
    },
  }));

export type IGroundRefinanceEstimateRate = Instance<
  typeof GroundRefinanceEstimateRate
>;
export type SGroundRefinanceEstimateRate = SnapshotOut<
  typeof GroundRefinanceEstimateRate
>;
