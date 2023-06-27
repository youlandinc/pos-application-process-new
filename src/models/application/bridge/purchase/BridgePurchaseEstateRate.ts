import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BridgePurchaseEstimateRateData } from '@/types/application/bridge';
import { VariableName } from '@/types/enum';

export const BPEstimateRate = types
  .model({
    purchasePrice: types.maybe(types.number),
    purchaseLoanAmount: types.maybe(types.number),
    isCor: types.maybe(types.boolean),
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
    getPostData(): Variable<BridgePurchaseEstimateRateData> {
      const { purchasePrice, purchaseLoanAmount, isCor, cor, arv } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          purchasePrice,
          purchaseLoanAmount,
          isCor,
          cor,
          arv,
        },
      };
    },
    injectServerData(value: BridgePurchaseEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount, isCor, cor, arv } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.isCor = isCor;
      self.cor = cor;
      self.arv = arv;
    },
  }));

export type IBPEstimateRate = Instance<typeof BPEstimateRate>;
export type SBPEstimateRate = SnapshotOut<typeof BPEstimateRate>;
