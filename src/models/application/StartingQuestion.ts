import { types } from 'mobx-state-tree';
import {
  LoanCitizenshipEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  LoanTypeEnum,
  StartingQuestionFormData,
} from '@/types';

export const ApplicationStartingQuestion = types
  .model({
    loanType: types.union(
      types.literal(LoanTypeEnum.bridge),
      types.literal(LoanTypeEnum.mortgage),
    ),
    productCategory: types.union(
      types.literal(LoanProductCategoryEnum.default),
      types.literal(LoanProductCategoryEnum.stabilized_bridge),
      types.literal(LoanProductCategoryEnum.fix_and_flip),
      types.literal(LoanProductCategoryEnum.ground_up_construction),
    ),
    loanPurpose: types.union(
      types.literal(LoanPurposeEnum.default),
      types.literal(LoanPurposeEnum.purchase),
      types.literal(LoanPurposeEnum.refinance),
    ),
    propertyType: types.union(
      types.literal(LoanPropertyTypeEnum.default),
      types.literal(LoanPropertyTypeEnum.single_family),
      types.literal(LoanPropertyTypeEnum.townhouse),
      types.literal(LoanPropertyTypeEnum.condo),
      types.literal(LoanPropertyTypeEnum.two_to_four_family),
    ),
    propertyUnit: types.union(
      types.literal(LoanPropertyUnitEnum.default),
      types.literal(LoanPropertyUnitEnum.two_units),
      types.literal(LoanPropertyUnitEnum.three_units),
      types.literal(LoanPropertyUnitEnum.four_units),
    ),
    citizenship: types.union(
      types.literal(LoanCitizenshipEnum.default),
      types.literal(LoanCitizenshipEnum.us_citizen),
      types.literal(LoanCitizenshipEnum.permanent_resident_alien),
      types.literal(LoanCitizenshipEnum.foreign_national),
    ),
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
        citizenship: self.citizenship,
      };
    },
  }))
  .views((self) => ({
    get isValid() {
      const baseCondition =
        !!self.loanType &&
        !!self.citizenship &&
        !!self.productCategory &&
        self.isOccupyProperty;

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
        citizenship,
      } = data;

      self.loanType = loanType ?? LoanTypeEnum.bridge;
      self.productCategory =
        productCategory ?? LoanProductCategoryEnum.stabilized_bridge;
      self.loanPurpose = loanPurpose ?? LoanPurposeEnum.purchase;
      self.propertyType = propertyType ?? LoanPropertyTypeEnum.single_family;
      self.propertyUnit = propertyUnit ?? LoanPropertyUnitEnum.two_units;
      self.citizenship = citizenship ?? LoanCitizenshipEnum.us_citizen;
      self.isOccupyProperty = isOccupyProperty;
    },
  }));
