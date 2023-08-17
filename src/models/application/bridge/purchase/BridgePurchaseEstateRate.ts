import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BPEstimateRateData } from '@/types/application/bridge';

import { VariableName } from '@/types/enum';

export const BPEstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
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
      const { purchasePrice, purchaseLoanAmount, closeDate } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          purchasePrice,
          purchaseLoanAmount,
          closeDate,
        },
      };
    },
    injectServerData(value: BPEstimateRateData) {
      const { purchasePrice, purchaseLoanAmount, closeDate } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.closeDate = closeDate as unknown as null;
    },
  }));

export type IBPEstimateRate = Instance<typeof BPEstimateRate>;
export type SBPEstimateRate = SnapshotOut<typeof BPEstimateRate>;
