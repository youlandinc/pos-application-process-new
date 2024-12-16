import { types } from 'mobx-state-tree';
import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  LoanTypeEnum,
  StartingQuestionFormData,
} from '@/types';

export const ApplicationStartingQuestion = types
  .model({
    loanType: types.enumeration(Object.values(LoanTypeEnum)),
    productCategory: types.enumeration(Object.values(LoanProductCategoryEnum)),
    loanPurpose: types.enumeration(Object.values(LoanPurposeEnum)),
    propertyType: types.enumeration(Object.values(LoanPropertyTypeEnum)),
    propertyUnit: types.enumeration(Object.values(LoanPropertyUnitEnum)),
    isOccupyProperty: types.boolean,
  })
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      self[key] = value;
    },
    getPostData() {
      return {
        loanType: self.loanType,
        productCategory: self.productCategory,
        loanPurpose: self.loanPurpose,
        propertyType: self.propertyType,
        propertyUnit: self.propertyUnit,
        isOccupyProperty: self.isOccupyProperty,
      };
    },
  }))
  .views((self) => ({
    get isValid() {
      const baseCondition =
        !!self.loanType && !!self.productCategory && self.isOccupyProperty;

      if (!self.propertyType) {
        return false;
      }
      if (self.propertyType === LoanPropertyTypeEnum.two_to_four_family) {
        return baseCondition && !!self.propertyUnit;
      }
      return baseCondition && !!self.propertyType;
    },
    injectServerData(data: StartingQuestionFormData) {
      const {
        loanType,
        productCategory,
        loanPurpose,
        propertyType,
        propertyUnit,
        isOccupyProperty,
      } = data;

      self.loanType = loanType ?? LoanTypeEnum.bridge;
      self.productCategory =
        productCategory ?? LoanProductCategoryEnum.stabilized_bridge;
      self.loanPurpose = loanPurpose ?? LoanPurposeEnum.purchase;
      self.propertyType = propertyType ?? LoanPropertyTypeEnum.single_family;
      self.propertyUnit = propertyUnit ?? LoanPropertyUnitEnum.two_units;
      self.isOccupyProperty = isOccupyProperty;
    },
  }));
