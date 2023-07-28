import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BPEstimateRateData } from '@/types/application/bridge';

import { VariableName } from '@/types/enum';

export const BPEstimateRate = types
  .model({
    purchasePrice: types.maybe(types.number),
    purchaseLoanAmount: types.maybe(types.number),
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
    getPostData(): Variable<BPEstimateRateData> {
      const { purchasePrice, purchaseLoanAmount } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          purchasePrice,
          purchaseLoanAmount,
        },
      };
    },
    injectServerData(value: BPEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
    },
  }));

export type IBPEstimateRate = Instance<typeof BPEstimateRate>;
export type SBPEstimateRate = SnapshotOut<typeof BPEstimateRate>;
