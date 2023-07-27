import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  BridgePurchase,
  BridgeRefinance,
  FixPurchase,
  FixRefinance,
  MortgagePurchase,
  MortgageRefinance,
  SBridgePurchase,
  SBridgeRefinance,
  SFixPurchase,
  SFixRefinance,
  SMortgagePurchase,
  SMortgageRefinance,
} from '@/models/application/base';
import { FormData } from '@/constants';

const Union = types.union({
  dispatcher: (
    snapshot:
      | SMortgagePurchase
      | SMortgageRefinance
      | SBridgePurchase
      | SBridgeRefinance
      | SFixPurchase
      | SFixRefinance
      | undefined,
  ) => {
    if (!snapshot) {
      return types.undefined;
    }
    switch (snapshot.name) {
      case 'MortgagePurchase':
        return MortgagePurchase;

      case 'MortgageRefinance':
        return MortgageRefinance;

      case 'BridgePurchase':
        return BridgePurchase;

      case 'BridgeRefinance':
        return BridgeRefinance;

      case 'FixAndFlipPurchase':
        return FixPurchase;

      case 'FixAndFlipRefinance':
        return FixRefinance;

      //case 'GroundPurchase':
      //  return GroundPurchase;
      //case 'GroundRefinance':
      //  return GroundRefinance;
      default:
        return types.undefined;
    }
  },
});

export const ApplicationForm = types
  .model({
    initialized: types.boolean,
    productCategory: types.frozen<ProductCategory>(),
    applicationType: types.frozen<ApplicationType>(),
    formData: types.maybe(Union),
  })
  .actions((self) => ({
    initForm(
      productCategory: ProductCategory,
      applicationType: ApplicationType,
    ) {
      if (productCategory && applicationType) {
        self.applicationType = applicationType;
        self.productCategory = productCategory;
        self.formData = {
          ...FormData[productCategory][applicationType],
        };
        this.setInitialized(true);
      }
    },
    setInitialized(initialized: boolean) {
      self.initialized = initialized;
    },
  }));

export type IApplicationForm = Instance<typeof ApplicationForm>;
export type SApplicationForm = SnapshotOut<typeof ApplicationForm>;
