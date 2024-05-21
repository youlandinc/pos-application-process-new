import {
  LoanAnswerEnum,
  LoanFicoScoreEnum,
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
    productCategory: LoanProductCategoryEnum.stabilized_bridge, // STABILIZED_BRIDGE,   FIX_AND_FLIP,   GROUND_UP_CONSTRUCTION
    loanPurpose: LoanPurposeEnum.purchase, // purchase, refinance
    propertyType: LoanPropertyTypeEnum.single_family, //  SINGLE_FAMILY,   TOWNHOUSE,  CONDO,   UNITS24
    propertyUnit: LoanPropertyUnitEnum.two_units, //  TWO_UNITS,   THREE_UNITS,   FOUR_UNITS
    isOccupyProperty: false,
  },
  [LoanSnapshotEnum.estimate_rate]: {
    productCategory: LoanProductCategoryEnum.fix_and_flip, // STABILIZED_BRIDGE,   FIX_AND_FLIP,   GROUND_UP_CONSTRUCTION
    loanPurpose: LoanPurposeEnum.purchase, // purchase, refinance
    propertyType: LoanPropertyTypeEnum.single_family, //  SINGLE_FAMILY,   TOWNHOUSE,  CONDO,   UNITS24
    propertyUnit: LoanPropertyUnitEnum.two_units,
    // common search condition params
    state: 'CA',
    ficoScore: LoanFicoScoreEnum.between_700_749,
    // for now not use liquidity
    isLiquidity: true,
    liquidityAmount: 100000,
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
  },
  [LoanSnapshotEnum.background_information]: {
    hadBankruptcy: LoanAnswerEnum.not_sure,
    hadDelinquent: LoanAnswerEnum.not_sure,
    hadForeclosure: LoanAnswerEnum.not_sure,
    hadFelony: LoanAnswerEnum.not_sure,
    hadLitigation: LoanAnswerEnum.not_sure,
  },
  [LoanSnapshotEnum.compensation_page]: {
    // user type broker/loan officer
    // agent fee use processing fee
    originationPoints: 0, // %
    processingFee: 0,
    isAdditional: false,
    additionalInfo: '',
  },
  // pipelineTaskDefaultData: {
  //   // common
  //   [PipelineTaskKey.AI]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.AI],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         aptNumber: '',
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         lat: void 0,
  //         lng: void 0,
  //         errors: {},
  //         isValid: false,
  //       },
  //       bankName: '',
  //       accountName: '',
  //       routingNumber: '',
  //       accountNumber: '',
  //       accountType: PipelineACHAccountType.DEFAULT,
  //       documentFile: undefined,
  //     },
  //   },
  //   [PipelineTaskKey.WF]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.WF],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       taskFiles: [],
  //     },
  //   },
  //   // broker
  //   [PipelineTaskKey.BA]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.BA],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         aptNumber: '',
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         lat: void 0,
  //         lng: void 0,
  //         isValid: false,
  //       },
  //       phoneNumber: '',
  //       email: '',
  //       title: '',
  //       fullName: '',
  //       company: '',
  //       documentFile: undefined,
  //     },
  //   },
  //   [PipelineTaskKey.BG]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.BG],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       taskFiles: [],
  //     },
  //   },
  //   [PipelineTaskKey.BL]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.BL],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       taskFiles: [],
  //     },
  //   },
  //   [PipelineTaskKey.BQ]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.BQ],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       licenses: [
  //         {
  //           ownerName: '',
  //           ssn: '',
  //           birthday: null,
  //           state: '',
  //           licenseType: PipelineLicenseTypeOpt.default,
  //           license: '',
  //         },
  //       ],
  //       documentFile: undefined,
  //     },
  //   },
  //   // lender
  //   [PipelineTaskKey.LA]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LA],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         lat: void 0,
  //         lng: void 0,
  //         aptNumber: '',
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         isValid: false,
  //       },
  //       phoneNumber: '',
  //       email: '',
  //       title: '',
  //       fullName: '',
  //       company: '',
  //       documentFile: undefined,
  //     },
  //   },
  //   [PipelineTaskKey.LG]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LG],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       taskFiles: [],
  //     },
  //   },
  //   [PipelineTaskKey.LL]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LL],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       taskFiles: [],
  //     },
  //   },
  //   [PipelineTaskKey.LQ]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LQ],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       licenses: [
  //         {
  //           ownerName: '',
  //           ssn: '',
  //           birthday: null,
  //           state: '',
  //           licenseType: PipelineLicenseTypeOpt.default,
  //           license: '',
  //         },
  //       ],
  //       documentFile: undefined,
  //     },
  //   },
  //   // loan officer
  //   [PipelineTaskKey.LOA]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LOA],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         lat: void 0,
  //         lng: void 0,
  //         aptNumber: '',
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         isValid: false,
  //       },
  //       phoneNumber: '',
  //       email: '',
  //       title: '',
  //       fullName: '',
  //       company: '',
  //       licenses: PipelineLicenseType.DEFAULT,
  //     },
  //   },
  //   [PipelineTaskKey.LOI]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.LOI],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         lat: void 0,
  //         lng: void 0,
  //         aptNumber: '',
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         isValid: false,
  //       },
  //       bankName: '',
  //       accountName: '',
  //       routingNumber: '',
  //       accountNumber: '',
  //       accountType: PipelineACHAccountType.DEFAULT,
  //     },
  //   },
  //   // real estate agent
  //   [PipelineTaskKey.REAA]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.REAA],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         aptNumber: '',
  //         lat: void 0,
  //         lng: void 0,
  //         state: '',
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         isValid: false,
  //       },
  //       phoneNumber: '',
  //       email: '',
  //       title: '',
  //       fullName: '',
  //       company: '',
  //       licenses: PipelineLicenseType.DEFAULT,
  //     },
  //   },
  //   [PipelineTaskKey.REAI]: {
  //     taskName: PipelineTaskName[PipelineTaskKey.REAI],
  //     taskId: '',
  //     taskStatus: PipelineTaskItemStatus.UNFINISHED,
  //     taskForm: {
  //       address: {
  //         formatAddress: '',
  //         aptNumber: '',
  //         state: '',
  //         lat: void 0,
  //         lng: void 0,
  //         street: '',
  //         city: '',
  //         postcode: '',
  //         errors: {},
  //         isValid: false,
  //       },
  //       bankName: '',
  //       accountName: '',
  //       routingNumber: '',
  //       accountNumber: '',
  //       accountType: PipelineACHAccountType.DEFAULT,
  //     },
  //   },
  // },
};
