import { types } from 'mobx-state-tree';
import {
  EstimateRateFormData,
  LoanCitizenshipEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';

export const EstimateRate = types
  .model({
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
    priorExperience: types.maybe(types.number),
    state: types.string,
    ficoScore: types.union(
      types.literal(LoanFicoScoreEnum.default),
      types.literal(LoanFicoScoreEnum.no_fico),
      types.literal(LoanFicoScoreEnum.fico_not_available),
      types.literal(LoanFicoScoreEnum.below_600),
      types.literal(LoanFicoScoreEnum.between_600_649),
      types.literal(LoanFicoScoreEnum.between_650_699),
      types.literal(LoanFicoScoreEnum.between_700_749),
      types.literal(LoanFicoScoreEnum.between_750_799),
      types.literal(LoanFicoScoreEnum.above_800),
    ),
    isLiquidity: types.maybe(types.boolean),
    liquidityAmount: types.maybe(types.number),
    rehabCost: types.maybe(types.number),
    arv: types.maybe(types.number),
    purchasePrice: types.maybe(types.number),
    purchaseLoanAmount: types.maybe(types.number),
    propertyValue: types.maybe(types.number),
    refinanceLoanAmount: types.maybe(types.number),
    isPayoff: types.maybe(types.boolean),
    payoffAmount: types.maybe(types.number),
    originationPoints: types.maybe(types.number),
    processingFee: types.maybe(types.number),
    isCustom: types.boolean,
    loanTerm: types.maybe(types.number),
    interestRate: types.maybe(types.number),
    isDutch: types.maybe(types.boolean),
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
        productCategory: self.productCategory,
        loanPurpose: self.loanPurpose,
        propertyType: self.propertyType,
        propertyUnit: self.propertyUnit,
        state: self.state,
        ficoScore:
          self.citizenship === LoanCitizenshipEnum.foreign_national
            ? LoanFicoScoreEnum.no_fico
            : self.ficoScore,
        isLiquidity: self.isLiquidity,
        liquidityAmount: self.liquidityAmount,
        rehabCost: self.rehabCost,
        arv: self.arv,
        purchasePrice: self.purchasePrice,
        purchaseLoanAmount: self.purchaseLoanAmount,
        propertyValue: self.propertyValue,
        refinanceLoanAmount: self.refinanceLoanAmount,
        isPayoff: self.isPayoff,
        payoffAmount: self.payoffAmount,
        originationPoints: self.originationPoints,
        processingFee: self.processingFee,
        isCustom: self.isCustom,
        loanTerm: self.loanTerm,
        interestRate: self.interestRate,
        isDutch: self.isDutch,
        citizenship: self.citizenship,
        priorExperience: self.priorExperience,
      };
    },
    injectServerData(data: EstimateRateFormData) {
      const {
        productCategory,
        loanPurpose,
        propertyType,
        propertyUnit,
        state,
        ficoScore,
        isLiquidity,
        liquidityAmount,
        rehabCost,
        arv,
        purchasePrice,
        purchaseLoanAmount,
        propertyValue,
        refinanceLoanAmount,
        isPayoff,
        payoffAmount,
        isCustom,
        loanTerm,
        interestRate,
        isDutch,
        citizenship,
        priorExperience,
      } = data;

      self.productCategory =
        productCategory ?? LoanProductCategoryEnum.stabilized_bridge;
      self.loanPurpose = loanPurpose ?? LoanPurposeEnum.purchase;
      self.propertyType = propertyType ?? LoanPropertyTypeEnum.single_family;
      self.propertyUnit = propertyUnit ?? LoanPropertyUnitEnum.two_units;
      self.citizenship = citizenship ?? LoanCitizenshipEnum.us_citizen;
      self.priorExperience = priorExperience ?? 0;
      self.state = state ?? 'CA';
      self.ficoScore = ficoScore ?? LoanFicoScoreEnum.between_700_749;
      self.isLiquidity = isLiquidity ?? true;
      self.liquidityAmount = liquidityAmount ?? undefined;
      self.rehabCost = rehabCost ?? undefined;
      self.arv = arv ?? undefined;
      self.purchasePrice = purchasePrice ?? undefined;
      self.purchaseLoanAmount = purchaseLoanAmount ?? undefined;
      self.propertyValue = propertyValue ?? undefined;
      self.refinanceLoanAmount = refinanceLoanAmount ?? undefined;
      self.isPayoff = isPayoff ?? false;
      self.payoffAmount = payoffAmount ?? undefined;
      self.isCustom = isCustom ?? false;
      self.loanTerm = isCustom ? loanTerm : undefined;
      self.interestRate = isCustom ? interestRate * 100 : undefined;
      self.isDutch = isDutch ?? false;
    },
  }));
