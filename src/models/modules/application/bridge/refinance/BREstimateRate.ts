import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BREstimateRateData } from '@/types/variable';
import { VariableName } from '@/types/enum';

export const BREstimateRate = types
  .model({
    homeValue: types.maybe(types.number),
    balance: types.maybe(types.number),
    isCashOut: types.maybe(types.boolean),
    cashOutAmount: types.maybe(types.number),
    isCor: types.maybe(types.boolean),
    cor: types.maybe(types.number),
    arv: types.maybe(types.number),
  })
  .views((self) => ({
    get checkIsValid() {
      return true;
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: typeof self[T],
    ) {
      self[key] = value;
    },
    getPostData(): Variable<BREstimateRateData> {
      const { homeValue, balance, isCashOut, cashOutAmount, isCor, cor, arv } =
        self;

      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          isCor,
          cor,
          arv,
        },
      };
    },
    injectServerData(value: BREstimateRateData) {
      const { homeValue, balance, isCashOut, cashOutAmount, isCor, cor, arv } =
        value;

      self.homeValue = homeValue;
      self.balance = balance;
      self.isCashOut = isCashOut;
      self.cashOutAmount = cashOutAmount;
      self.isCor = isCor;
      self.cor = cor;
      self.arv = arv;
    },
  }));

export type IBREstimateRate = Instance<typeof BREstimateRate>;
export type SBREstimateRate = SnapshotOut<typeof BREstimateRate>;
