import { types } from 'mobx-state-tree';
import {
  EstimateRateFormData,
  LoanCitizenshipEnum,
  LoanFicoScoreEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  PrepaymentPenaltyEnum,
} from '@/types';

export const EstimateRate = types
  .model({
    productCategory: types.enumeration(Object.values(LoanProductCategoryEnum)),
    loanPurpose: types.enumeration(Object.values(LoanPurposeEnum)),
    propertyType: types.enumeration(Object.values(LoanPropertyTypeEnum)),
    propertyUnit: types.enumeration(Object.values(LoanPropertyUnitEnum)),
    citizenship: types.enumeration(Object.values(LoanCitizenshipEnum)),
    priorExperience: types.maybe(types.number),
    state: types.string,
    ficoScore: types.enumeration(Object.values(LoanFicoScoreEnum)),
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
    improvementsSinceAcquisition: types.maybe(types.number),
    constructionProjectsExited: types.maybe(types.number),
    purchaseConstructionCosts: types.maybe(types.number),
    refinanceConstructionCosts: types.maybe(types.number),
    ltc: types.maybe(types.number),
    monthlyIncome: types.maybe(types.number),
    propertyInsurance: types.maybe(types.number),
    propertyTaxes: types.maybe(types.number),
    monthlyHoaFee: types.maybe(types.number),
    prepaymentPenalty: types.enumeration(Object.values(PrepaymentPenaltyEnum)),
    acquisitionDate: types.maybe(types.string),
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
        // ground up
        improvementsSinceAcquisition: self.improvementsSinceAcquisition,
        constructionProjectsExited: self.constructionProjectsExited,
        purchaseConstructionCosts: self.purchaseConstructionCosts,
        refinanceConstructionCosts: self.refinanceConstructionCosts,
        ltc: Math.floor((self.ltc as number) * 1000000) / 100000000,
        // rental
        monthlyIncome: self.monthlyIncome,
        propertyInsurance: self.propertyInsurance,
        propertyTaxes: self.propertyTaxes,
        monthlyHoaFee: self.monthlyHoaFee,
        prepaymentPenalty: self.prepaymentPenalty,
        acquisitionDate: self.acquisitionDate,
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
        improvementsSinceAcquisition,
        constructionProjectsExited,
        purchaseConstructionCosts,
        refinanceConstructionCosts,
        ltc,
        monthlyIncome,
        propertyInsurance,
        propertyTaxes,
        monthlyHoaFee,
        prepaymentPenalty,
        acquisitionDate,
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
      self.improvementsSinceAcquisition =
        improvementsSinceAcquisition ?? undefined;
      self.constructionProjectsExited = constructionProjectsExited ?? undefined;
      self.purchaseConstructionCosts = purchaseConstructionCosts ?? undefined;
      self.refinanceConstructionCosts = refinanceConstructionCosts ?? undefined;
      self.ltc = ltc * 100 ?? undefined;
      self.monthlyIncome = monthlyIncome ?? undefined;
      self.propertyInsurance = propertyInsurance ?? undefined;
      self.propertyTaxes = propertyTaxes ?? undefined;
      self.monthlyHoaFee = monthlyHoaFee ?? undefined;
      self.prepaymentPenalty =
        prepaymentPenalty ?? PrepaymentPenaltyEnum.three_year;
      self.acquisitionDate = acquisitionDate ?? '';
    },
  }));
