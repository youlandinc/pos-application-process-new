import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { Address } from '@/models/common/Address';

import { OfferOpt, ProcessOpt, PurchaseTimeOpt } from '@/types/options';

export const MortgagePurchasePurpose = types
  .model({
    values: types.model({
      stageOpt: types.union(
        types.literal(ProcessOpt.researching),
        types.literal(ProcessOpt.makingOffer),
        types.literal(ProcessOpt.signedPurchase),
        types.literal(ProcessOpt.default),
      ),
      offerOpt: types.union(
        types.literal(OfferOpt.preApproval),
        types.literal(OfferOpt.isAfford),
        types.literal(OfferOpt.realEstate),
        types.literal(OfferOpt.default),
      ),
      purchaseTimeOpt: types.union(
        types.literal(PurchaseTimeOpt.quarter),
        types.literal(PurchaseTimeOpt.half),
        types.literal(PurchaseTimeOpt.year),
        types.literal(PurchaseTimeOpt.notSure),
        types.literal(PurchaseTimeOpt.default),
      ),
      address: Address,
    }),
  })
  .views((self) => ({
    get checkIsValid() {
      if (self.values.stageOpt === ProcessOpt.signedPurchase) {
        return self.values.address.checkAddressValid;
      }
      return (
        self.values.offerOpt &&
        self.values.purchaseTimeOpt &&
        self.values.address.checkFuzzyAddress
      );
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof (typeof self)['values']>(
      key: T,
      value: (typeof self)['values'][T],
    ) {
      self.values[key] = value;
    },
  }));

export type IMortgagePurchasePurpose = Instance<typeof MortgagePurchasePurpose>;
export type SMortgagePurchasePurpose = SnapshotOut<
  typeof MortgagePurchasePurpose
>;
