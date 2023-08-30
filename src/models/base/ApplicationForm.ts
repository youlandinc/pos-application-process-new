import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  BridgePurchase,
  BridgeRefinance,
  FixPurchase,
  FixRefinance,
  GroundPurchase,
  GroundRefinance,
  MortgagePurchase,
  MortgageRefinance,
  SBridgePurchase,
  SBridgeRefinance,
  SFixPurchase,
  SFixRefinance,
  SGroundPurchase,
  SGroundRefinance,
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
      | SGroundPurchase
      | SGroundRefinance
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

      case 'GroundUpConstructionPurchase':
        return GroundPurchase;
      case 'GroundUpConstructionRefinance':
        return GroundRefinance;
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
    resetForm() {
      self.formData = undefined;
      self.initialized = false;
      self.applicationType = undefined;
    },
  }));

export type IApplicationForm = Instance<typeof ApplicationForm>;
export type SApplicationForm = SnapshotOut<typeof ApplicationForm>;
