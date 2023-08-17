import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FPEstimateRateData } from '@/types/application/fix';

import { VariableName } from '@/types/enum';

export const FixPurchaseEstimateRate = types
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
    getPostData(): Variable<FPEstimateRateData> {
      const { purchasePrice, purchaseLoanAmount, cor, arv, closeDate } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          closeDate,
        },
      };
    },
    injectServerData(value: FPEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount, cor, arv, closeDate } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.cor = cor;
      self.arv = arv;
      self.closeDate = closeDate as unknown as null;
    },
  }));

export type IFixPurchaseEstimateRate = Instance<typeof FixPurchaseEstimateRate>;
export type SFixPurchaseEstimateRate = SnapshotOut<
  typeof FixPurchaseEstimateRate
>;
