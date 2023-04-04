import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/base';
import { Options } from '@/types/options';

export const MortgagePurchasePurpose = types
  .model({
    values: types.model({
      stageOpt: types.union(
        types.literal(Options.ProcessOpt.researching),
        types.literal(Options.ProcessOpt.makingOffer),
        types.literal(Options.ProcessOpt.signedPurchase),
        types.literal(Options.ProcessOpt.default),
      ),
      offerOpt: types.union(
        types.literal(Options.OfferOpt.preApproval),
        types.literal(Options.OfferOpt.isAfford),
        types.literal(Options.OfferOpt.realEstate),
        types.literal(Options.OfferOpt.default),
      ),
      purchaseTimeOpt: types.union(
        types.literal(Options.PurchaseTimeOpt.quarter),
        types.literal(Options.PurchaseTimeOpt.half),
        types.literal(Options.PurchaseTimeOpt.year),
        types.literal(Options.PurchaseTimeOpt.notSure),
        types.literal(Options.PurchaseTimeOpt.default),
      ),
      address: Address,
    }),
  })
  .views((self) => ({
    get checkIsValid() {
      if (self.values.stageOpt === Options.ProcessOpt.signedPurchase) {
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
