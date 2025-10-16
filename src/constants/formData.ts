import {
  IntendedUseEnum,
  LoanAnswerEnum,
  LoanCitizenshipEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  LoanSnapshotEnum,
  LoanTypeEnum,
} from '@/types';

export const FormData = {
  [LoanSnapshotEnum.starting_question]: {
    loanType: LoanTypeEnum.bridge, // BRIDGE, MORTGAGE
    productCategory: LoanProductCategoryEnum.stabilized_bridge, // STABILIZED_BRIDGE,   FIX_AND_FLIP,   GROUND_UP_CONSTRUCTION,  DSCR_RENTAL
    loanPurpose: LoanPurposeEnum.purchase, // purchase, refinance
    propertyType: LoanPropertyTypeEnum.single_family, //  SINGLE_FAMILY, TOWNHOUSE, CONDO, UNITS24
    propertyUnit: LoanPropertyUnitEnum.two_units, //  TWO_UNITS,   THREE_UNITS,   FOUR_UNITS
    isOccupyProperty: false,
  },
  [LoanSnapshotEnum.land_readiness]: {
    intendedUse: IntendedUseEnum.single_family,
    hasObtained: LoanAnswerEnum.yes,
    hasCompleted: LoanAnswerEnum.yes,
    hasTimeline: LoanAnswerEnum.yes,
  },
  [LoanSnapshotEnum.estimate_rate]: {
    productCategory: LoanProductCategoryEnum.fix_and_flip, // STABILIZED_BRIDGE,   FIX_AND_FLIP,   GROUND_UP_CONSTRUCTION
    loanPurpose: LoanPurposeEnum.purchase, // purchase, refinance
    propertyType: LoanPropertyTypeEnum.single_family, //  SINGLE_FAMILY,   TOWNHOUSE,  CONDO,   UNITS24
    propertyUnit: LoanPropertyUnitEnum.default, //  TWO_UNITS,   THREE_UNITS,   FOUR_UNITS
    citizenship: LoanCitizenshipEnum.default, // US_CITIZEN,   PERMANENT_RESIDENT_ALIEN,   FOREIGN_NATIONAL
    renovationsCompleted: 0,
    constructionsCompleted: 0,
    priorExperience: 0,
    // common search condition params
    state: 'CA',
    ficoScore: null,
    accurateScore: null,
    // for now not use liquidity
    isLiquidity: true,
    liquidityAmount: 100000,
    // fix
    propertyOwned: LoanAnswerEnum.no,
    // fix or ground-up
    rehabCost: 0,
    arv: 0, // after repair value
    // purchase
    purchasePrice: 200000,
    purchaseLoanAmount: 150000,
    // refinance
    propertyValue: 0,
    refinanceLoanAmount: 0,
    isPayoff: false,
    payoffAmount: 0,
    // custom rate
    // only one params
    isCustom: false,
    loanTerm: 0,
    interestRate: 0,
    // dutch / no dutch
    isDutch: false,
    // ground-up
    improvementsSinceAcquisition: 0,
    constructionProjectsExited: 0,
    purchaseConstructionCosts: 0,
    refinanceConstructionCosts: 0,
    ltc: 0,
    // dscr rental
    monthlyIncome: void 0,
    operatingExpense: void 0,
    propertyInsurance: void 0,
    propertyTaxes: void 0,
    monthlyHoaFee: void 0,
    vacancyRate: void 0,
    acquisitionDate: '',
    prepaymentPenalty: '',
    // fix & guc purchase
    wholesaler: LoanAnswerEnum.yes,
  },
  [LoanSnapshotEnum.loan_address]: {
    formatAddress: '',
    aptNumber: '',
    state: '',
    street: '',
    city: '',
    postcode: '',
    lat: void 0,
    lng: void 0,
    errors: {},
    isValid: false,
    additionalAddress: [],
    editable: false,
  },
  [LoanSnapshotEnum.background_information]: {
    hadBankruptcy: LoanAnswerEnum.not_sure,
    hadDelinquent: LoanAnswerEnum.not_sure,
    hadForeclosure: LoanAnswerEnum.not_sure,
    hadFelony: LoanAnswerEnum.not_sure,
    hadLitigation: LoanAnswerEnum.not_sure,
  },
  [LoanSnapshotEnum.select_executive]: {
    executiveId: '',
    executiveName: '',
  },
  [LoanSnapshotEnum.compensation_page]: {
    // user type broker/loan officer
    // agent fee use processing fee
    executiveId: '',
    executiveName: '',
    originationPoints: 0, // %
    processingFee: 0,
    isAdditional: false,
    additionalInfo: '',
    additionalFees: [],
  },
};
