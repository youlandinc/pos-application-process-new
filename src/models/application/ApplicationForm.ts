import { Instance, types } from 'mobx-state-tree';
import {
  BridgePurchase,
  BridgeRefinance,
  MortgagePurchase,
  MortgageRefinance,
  SBridgePurchase,
  SBridgeRefinance,
  SMortgagePurchase,
  SMortgageRefinance,
} from '@/models/product';
import { FormData } from '@/constants/formData';

const Union = types.union({
  dispatcher: (
    snapshot:
      | SMortgagePurchase
      | SMortgageRefinance
      | SBridgePurchase
      | SBridgeRefinance
      | undefined,
  ) => {
    if (!snapshot) {
      return types.undefined;
    }
    switch (snapshot.name) {
      case 'MortgagePurchase': {
        return MortgagePurchase;
      }
      case 'MortgageRefinance': {
        return MortgageRefinance;
      }
      case 'BridgePurchase': {
        return BridgePurchase;
      }
      case 'BridgeRefinance': {
        return BridgeRefinance;
      }
    }
  },
});

export const ApplicationForm = types
  .model({
    initialized: types.boolean,
    productCategory: types.frozen<ProductCategory>(),
    applicationType: types.frozen<ApplicationType>(),
    formData: Union,
  })
  .actions((self) => ({
    initForm<
      T extends
        | SMortgagePurchase
        | SMortgageRefinance
        | SBridgePurchase
        | SBridgeRefinance,
    >(productCategory: ProductCategory, applicationType: ApplicationType) {
      self.applicationType = applicationType;
      self.productCategory = productCategory;
      self.formData = {
        ...FormDefaultValueMap[productCategory][applicationType],
      };
      this.setInitialized(true);
    },
    setInitialized(initialized: boolean) {
      self.initialized = initialized;
    },
  }));

export type IApplicationForm = Instance<typeof ApplicationForm>;
