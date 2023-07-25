import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FixPurchaseEstimateRateData } from '@/types/application/fix';

import { VariableName } from '@/types/enum';

export const FixPurchaseEstimateRate = types
  .model({
    purchasePrice: types.maybe(types.number),
    purchaseLoanAmount: types.maybe(types.number),
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
      1;
      self[key] = value;
    },
    getPostData(): Variable<FixPurchaseEstimateRateData> {
      const { purchasePrice, purchaseLoanAmount, cor, arv } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
        },
      };
    },
    injectServerData(value: FixPurchaseEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount, cor, arv } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.cor = cor;
      self.arv = arv;
    },
  }));

export type IFixPurchaseEstimateRate = Instance<typeof FixPurchaseEstimateRate>;
export type SFixPurchaseEstimateRate = SnapshotOut<
  typeof FixPurchaseEstimateRate
>;
