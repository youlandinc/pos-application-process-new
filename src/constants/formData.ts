import {
  ChannelOpt,
  FixAndFlipCreditScoreState,
  FixAndFlipPurchaseState,
  FixAndFlipRefinanceState,
  GroundUpConstructionCreditScoreState,
  GroundUpConstructionPurchaseState,
  GroundUpConstructionRefinanceState,
  OccupancyOpt,
  OfferOpt,
  PipelineACHAccountType,
  PipelineLicenseType,
  PipelineLicenseTypeOpt,
  ProcessOpt,
  PropertyNumberOpt,
  PropertyOpt,
  PropertyPlanOpt,
  PropertyPurposeOpt,
  PropertyTitleOpt,
  PropertyUnitOpt,
  PurchaseTimeOpt,
  RelationshipOpt,
  WhyRefinanceOpt,
} from '@/types';
import {
  AssetsState,
  BridgeCreditScoreState,
  BridgePurchaseState,
  BridgeRefinanceState,
  CreditScoreState,
  DTIState,
  MortgagePurchaseState,
  MortgageRefinanceAssetsState,
  MortgageRefinanceState,
  StartingState,
} from '@/types/enum';
import {
  PipelineTaskItemStatus,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/pipeline';

export const FormData = {
  mortgage: {
    purchase: {
      name: 'MortgagePurchase',
      preApproved: false,
      denialReason: void 0,
      state: MortgagePurchaseState.starting,
      starting: {
        purpose: {
          values: {
            stageOpt: ProcessOpt.default,
            offerOpt: OfferOpt.default,
            purchaseTimeOpt: PurchaseTimeOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            isValid: false,
          },
        },
        property: {
          values: {
            occupancyOpt: OccupancyOpt.default,
            propertyOpt: PropertyOpt.default,
            rentalIncome: undefined,
            numberOfUnits: PropertyUnitOpt.default,
          },
          errors: {},
          isValid: false,
        },
        state: StartingState.purpose,
      },
      creditScore: {
        values: {
          selfInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            ssn: '',
            email: '',
            authorizedCreditCheck: false,
            creditScore: 799,
            errors: {},
            isValid: false,
          },
          selfIncome: {
            salary: {
              annualSalary: undefined,
              bonuses: undefined,
              stock: undefined,
            },
            selfEmployed: {
              annualProfit: undefined,
              annualPaySelf: undefined,
            },
            socialSecurity: {
              totalIncome: undefined,
            },
            other: {
              monthlyChildSupport: undefined,
              monthlyAlimony: undefined,
              other: undefined,
            },
          },
          coBorrower: {
            hasCoOwners: undefined,
            hasCoBorrower: undefined,
            readyEnter: undefined,
          },
          coBorrowerRelationship: {
            relationship: RelationshipOpt.default,
            liveTogether: undefined,
            willLiveTogether: undefined,
          },
          coBorrowerInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            ssn: '',
            authorizedCreditCheck: false,
            creditScore: 799,
            errors: {},
            isValid: false,
          },
          coBorrowerIncome: {
            salary: {
              annualSalary: undefined,
              bonuses: undefined,
              stock: undefined,
            },
            selfEmployed: {
              annualProfit: undefined,
              annualPaySelf: undefined,
            },
            socialSecurity: {
              totalIncome: undefined,
            },
            other: {
              monthlyChildSupport: undefined,
              monthlyAlimony: undefined,
              other: undefined,
            },
          },
          borrowerDebts: [],
          coBorrowerDebts: [],
        },
        debtsTableState: false,
        payoffTableState: false,
        state: CreditScoreState.notice,
      },
      DTI: {
        state: DTIState.notice,
        dti: 0,
        reconciled: false,
        dtiMaxAcceptable: 0.43,
      },
      assets: {
        realEstateEditState: 'view',
        everOwnedEstate: undefined,
        ownCurrentEstate: undefined,
        ownOtherEstate: undefined,
        currentEstate: {
          isCurrentEstate: true,
          address: {
            formatAddress: '236 Kingfisher Avenue, Alameda, CA 94501',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: undefined,
            isValid: false,
          },
          expectSellPrice: undefined,
          expectRentPrice: undefined,
          sellForPurchaseNew: undefined,
          hasMonthlyPayment: undefined,
          propertyTitle: PropertyTitleOpt.default,
          propertyPlan: PropertyPlanOpt.default,
          propertyPurpose: PropertyPurposeOpt.default,
          loanList: [],
          interestedRefinancing: undefined,
        },
        realEstateList: [],
        financialSituation: {
          savingAccount: undefined,
          retirementAccount: undefined,
          stockAndBonds: undefined,
          giftFromRelative: undefined,
          loanAmount: undefined,
          salesOfRealEstate: undefined,
          other: undefined,
        },
        purchasePrice: undefined,
        downPayment: undefined,
        state: AssetsState.currentEstate,
        propertyPriceValid: false,
      },
      realtor: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        errors: {},
        isValid: false,
        isSkip: false,
      },
    },
    refinance: {
      name: 'MortgageRefinance',
      preApproved: false,
      denialReason: void 0,
      state: MortgageRefinanceState.starting,
      starting: {
        purpose: {
          values: {
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            isValid: false,
          },
        },
        property: {
          values: {
            homeValue: undefined,
            occupancyOpt: OccupancyOpt.default,
            propertyOpt: PropertyOpt.default,
            numberOfUnits: PropertyUnitOpt.default,
            rentalIncome: undefined,
          },
          errors: {},
          isValid: false,
        },
        state: StartingState.purpose,
      },
      creditScore: {
        values: {
          selfInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            ssn: '',
            email: '',
            authorizedCreditCheck: false,
            creditScore: 799,
            errors: {},
            isValid: false,
          },
          selfIncome: {
            salary: {
              annualSalary: undefined,
              bonuses: undefined,
              stock: undefined,
            },
            selfEmployed: {
              annualProfit: undefined,
              annualPaySelf: undefined,
            },
            socialSecurity: {
              totalIncome: undefined,
            },
            other: {
              monthlyChildSupport: undefined,
              monthlyAlimony: undefined,
              other: undefined,
            },
          },
          coBorrower: {
            hasCoOwners: undefined,
            hasCoBorrower: undefined,
            readyEnter: undefined,
          },
          coBorrowerRelationship: {
            relationship: RelationshipOpt.default,
            liveTogether: undefined,
            willLiveTogether: undefined,
          },
          coBorrowerInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
            ssn: '',
            authorizedCreditCheck: false,
            creditScore: 799,
            errors: {},
            isValid: false,
          },
          coBorrowerIncome: {
            salary: {
              annualSalary: undefined,
              bonuses: undefined,
              stock: undefined,
            },
            selfEmployed: {
              annualProfit: undefined,
              annualPaySelf: undefined,
            },
            socialSecurity: {
              totalIncome: undefined,
            },
            other: {
              monthlyChildSupport: undefined,
              monthlyAlimony: undefined,
              other: undefined,
            },
          },
          borrowerDebts: [],
          coBorrowerDebts: [],
        },
        borrowerDebtsTableState: undefined,
        borrowerPayoffTableState: undefined,
        coBorrowerDebtsTableState: undefined,
        coBorrowerPayoffTableState: undefined,
        state: CreditScoreState.notice,
      },
      monthlyPayment: {
        hasMonthlyPayment: undefined,
        loanList: [],
      },
      assets: {
        values: {
          residenceOwn: {
            ownCurrentEstate: undefined,
            hasMonthlyPayment: undefined,
            payments: [],
            propertyTitle: PropertyTitleOpt.default,
          },
          yourProperty: [],
          whyRefinance: {
            purpose: WhyRefinanceOpt.default,
            cashOut: undefined,
            payments: [],
            hasMonthlyPayment: false,
            cashValid: false,
            debtValid: false,
            totalBalance: 0,
          },
          financialSituation: {
            savingAccount: undefined,
            retirementAccount: undefined,
            stockAndBonds: undefined,
            giftFromRelative: undefined,
            loanAmount: undefined,
            salesOfRealEstate: undefined,
            other: undefined,
          },
        },
        estateEditState: 'view',
        state: MortgageRefinanceAssetsState.your_property,
      },
      DTI: {
        state: DTIState.notice,
        dti: 0,
        reconciled: false,
        dtiMaxAcceptable: 0.43,
      },
    },
  },
  bridge: {
    purchase: {
      name: 'BridgePurchase',
      preApproved: false,
      denialReason: void 0,
      state: BridgePurchaseState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 800,
          email: '',
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: BridgeCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        purchasePrice: undefined,
        purchaseLoanAmount: undefined,
        isRehab: false,
        rehabCost: undefined,
        arv: undefined,
      },
    },
    refinance: {
      name: 'BridgeRefinance',
      preApproved: false,
      denialReason: void 0,
      state: BridgeRefinanceState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          email: '',
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: BridgeCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        homeValue: undefined,
        balance: undefined,
        isCashOut: false,
        cashOutAmount: undefined,
        cor: undefined,
        arv: undefined,
      },
    },
  },
  fix_and_flip: {
    purchase: {
      name: 'FixAndFlipPurchase',
      preApproved: false,
      denialReason: void 0,
      state: FixAndFlipPurchaseState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 800,
          email: '',
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: FixAndFlipCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        purchasePrice: undefined,
        purchaseLoanAmount: undefined,
        isRehab: false,
        rehabCost: undefined,
        arv: undefined,
      },
    },
    refinance: {
      name: 'FixAndFlipRefinance',
      preApproved: false,
      denialReason: void 0,
      state: FixAndFlipRefinanceState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          email: '',
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: FixAndFlipCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        homeValue: undefined,
        balance: undefined,
        isCashOut: false,
        cashOutAmount: undefined,
        cor: undefined,
        arv: undefined,
      },
    },
  },
  ground_up_construction: {
    purchase: {
      name: 'GroundUpConstructionPurchase',
      preApproved: false,
      denialReason: void 0,
      state: GroundUpConstructionPurchaseState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 800,
          email: '',
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: GroundUpConstructionCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        purchasePrice: undefined,
        purchaseLoanAmount: undefined,
        isRehab: false,
        rehabCost: undefined,
        arv: undefined,
      },
    },
    refinance: {
      name: 'GroundUpConstructionRefinance',
      preApproved: false,
      denialReason: void 0,
      state: GroundUpConstructionRefinanceState.starting,
      starting: {
        purpose: {
          values: {
            propertyNumber: PropertyNumberOpt.default,
            address: {
              formatAddress: '',
              aptNumber: '',
              state: '',
              street: '',
              city: '',
              postcode: '',
              errors: {},
              isValid: false,
            },
          },
          isValid: false,
        },
        property: {
          values: {
            propertyType: PropertyOpt.default,
            propertyUnit: PropertyUnitOpt.default,
            isConfirm: false,
          },
        },
        state: StartingState.purpose,
      },
      creditScore: {
        selfInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          email: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        coBorrowerCondition: {
          isCoBorrower: undefined,
        },
        coBorrowerInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: null,
          citizenship: undefined,
          email: '',
          address: {
            formatAddress: '',
            aptNumber: '',
            state: '',
            street: '',
            city: '',
            postcode: '',
            errors: {},
            isValid: false,
          },
          ssn: '',
          authorizedCreditCheck: false,
          creditScore: 799,
          errors: {},
          isValid: false,
          needDateValidate: false,
        },
        state: GroundUpConstructionCreditScoreState.notice,
      },
      whereKnowUs: {
        reference: ChannelOpt.default,
      },
      estimateRate: {
        homeValue: undefined,
        balance: undefined,
        isCashOut: false,
        cashOutAmount: undefined,
        cor: undefined,
        arv: undefined,
      },
    },
  },
  pipelineTaskDefaultData: {
    // common
    [PipelineTaskKey.AI]: {
      taskName: PipelineTaskName[PipelineTaskKey.AI],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        bankName: '',
        accountName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: PipelineACHAccountType.DEFAULT,
        documentFile: undefined,
      },
    },
    [PipelineTaskKey.WF]: {
      taskName: PipelineTaskName[PipelineTaskKey.WF],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        taskFiles: [],
      },
    },
    // broker
    [PipelineTaskKey.BA]: {
      taskName: PipelineTaskName[PipelineTaskKey.BA],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        phoneNumber: '',
        email: '',
        title: '',
        fullName: '',
        company: '',
        documentFile: undefined,
      },
    },
    [PipelineTaskKey.BG]: {
      taskName: PipelineTaskName[PipelineTaskKey.BG],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        taskFiles: [],
      },
    },
    [PipelineTaskKey.BL]: {
      taskName: PipelineTaskName[PipelineTaskKey.BL],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        taskFiles: [],
      },
    },
    [PipelineTaskKey.BQ]: {
      taskName: PipelineTaskName[PipelineTaskKey.BQ],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        licenses: [
          {
            ownerName: '',
            ssn: '',
            birthday: null,
            state: '',
            licenseType: PipelineLicenseTypeOpt.default,
            license: '',
          },
        ],
        documentFile: undefined,
      },
    },
    // lender
    [PipelineTaskKey.LA]: {
      taskName: PipelineTaskName[PipelineTaskKey.LA],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        phoneNumber: '',
        email: '',
        title: '',
        fullName: '',
        company: '',
        documentFile: undefined,
      },
    },
    [PipelineTaskKey.LG]: {
      taskName: PipelineTaskName[PipelineTaskKey.LG],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        taskFiles: [],
      },
    },
    [PipelineTaskKey.LL]: {
      taskName: PipelineTaskName[PipelineTaskKey.LL],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        taskFiles: [],
      },
    },
    [PipelineTaskKey.LQ]: {
      taskName: PipelineTaskName[PipelineTaskKey.LQ],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        licenses: [
          {
            ownerName: '',
            ssn: '',
            birthday: null,
            state: '',
            licenseType: PipelineLicenseTypeOpt.default,
            license: '',
          },
        ],
        documentFile: undefined,
      },
    },
    // loan officer
    [PipelineTaskKey.LOA]: {
      taskName: PipelineTaskName[PipelineTaskKey.LOA],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        phoneNumber: '',
        email: '',
        title: '',
        fullName: '',
        company: '',
        licenses: PipelineLicenseType.DEFAULT,
      },
    },
    [PipelineTaskKey.LOI]: {
      taskName: PipelineTaskName[PipelineTaskKey.LOI],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        bankName: '',
        accountName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: PipelineACHAccountType.DEFAULT,
      },
    },
    // real estate agent
    [PipelineTaskKey.REAA]: {
      taskName: PipelineTaskName[PipelineTaskKey.REAA],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        phoneNumber: '',
        email: '',
        title: '',
        fullName: '',
        company: '',
        licenses: PipelineLicenseType.DEFAULT,
      },
    },
    [PipelineTaskKey.REAI]: {
      taskName: PipelineTaskName[PipelineTaskKey.REAI],
      taskId: '',
      taskStatus: PipelineTaskItemStatus.UNFINISHED,
      taskForm: {
        address: {
          formatAddress: '',
          aptNumber: '',
          state: '',
          street: '',
          city: '',
          postcode: '',
          errors: {},
          isValid: false,
        },
        bankName: '',
        accountName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: PipelineACHAccountType.DEFAULT,
      },
    },
  },
  task: {},
};
