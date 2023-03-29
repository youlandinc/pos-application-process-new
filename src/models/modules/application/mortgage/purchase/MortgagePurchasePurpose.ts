import { Address } from '@/models/modules';
import { OfferOpt, PurchaseTimeOpt, StageOpt } from '@/types/options';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const MortgagePurchasePurpose = types
  .model({
    values: types.model({
      stageOpt: types.union(
        types.literal(StageOpt.researching),
        types.literal(StageOpt.makingOffer),
        types.literal(StageOpt.signedPurchase),
        types.literal(StageOpt.default),
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
      if (self.values.stageOpt === StageOpt.signedPurchase) {
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
    changeFieldValue<T extends keyof typeof self['values']>(
      key: T,
      value: typeof self['values'][T],
    ) {
      self.values[key] = value;
    },
  }));

export type IMPPurpose = Instance<typeof MortgagePurchasePurpose>;
export type SMPPurpose = SnapshotOut<typeof MortgagePurchasePurpose>;
