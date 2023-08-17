import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { GPEstimateRateData } from '@/types/application/ground';

import { VariableName } from '@/types/enum';

export const GroundPurchaseEstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
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
      self[key] = value;
    },
    getPostData(): Variable<GPEstimateRateData> {
      const { purchasePrice, purchaseLoanAmount, cor, arv, closeDate } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          closeDate,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
        },
      };
    },
    injectServerData(value: GPEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount, cor, arv, closeDate } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.cor = cor;
      self.arv = arv;
      self.closeDate = closeDate as unknown as null;
    },
  }));

export type IGroundPurchaseEstimateRate = Instance<
  typeof GroundPurchaseEstimateRate
>;
export type SGroundPurchaseEstimateRate = SnapshotOut<
  typeof GroundPurchaseEstimateRate
>;
