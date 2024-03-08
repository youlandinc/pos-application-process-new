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
    getPostData(): Variable<GPEstimateRateData> {
      const {
        purchasePrice,
        purchaseLoanAmount,
        cor,
        arv,
        closeDate,
        customRate,
        loanTerm,
        interestRate,
      } = self;
      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          closeDate,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          customRate,
          loanTerm,
          interestRate,
        },
      };
    },
    injectModifyData(data: any) {
      self.purchaseLoanAmount = data.purchaseLoanAmount;
      self.purchasePrice = data.purchasePrice;
      self.cor = data.cor;
      self.arv = data.arv;
    },
    injectServerData(value: GPEstimateRateData) {
      const {
        purchasePrice,
        purchaseLoanAmount,
        cor,
        arv,
        closeDate,
        customRate,
        loanTerm,
        interestRate,
      } = value;
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
      self.cor = cor;
      self.arv = arv;
      self.closeDate = closeDate as unknown as null;
      self.customRate = customRate;
      self.loanTerm = loanTerm;
      self.interestRate = interestRate;
    },
  }));

export type IGroundPurchaseEstimateRate = Instance<
  typeof GroundPurchaseEstimateRate
>;
export type SGroundPurchaseEstimateRate = SnapshotOut<
  typeof GroundPurchaseEstimateRate
>;
