import { format } from 'date-fns';
import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { DebtData } from '@/models/common/DebtData';
import { Address, IAddress, SAddress } from '@/models/common/Address';

import {
  CommonBorrowerType,
  DebtWrongReasonOpt,
  RelationshipOpt,
} from '@/types/options';
import { CreditScoreState, VariableName } from '@/types/enum';
import {
  BorrowerDebtRecordData,
  BorrowerDebtSummaryData,
  IncomeData,
  MortgageAboutOtherRelationData,
  MortgageRecordDebtData,
  OtherIncomeData,
  SalaryIncomeData,
  SelfEmployIncomeData,
  SelfInfoData,
} from '@/types/application';

import validate from '@/constants/validate';
import { CreditScoreSchema } from '@/constants';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
} from '@/types';

export const PersonalInfo = types
  .model({
    borrowerType: types.maybe(
      types.union(
        types.literal(DashboardTaskBorrowerType.entity),
        types.literal(DashboardTaskBorrowerType.individual),
        types.literal(DashboardTaskBorrowerType.trust),
      ),
    ),
    entityType: types.maybe(
      types.union(
        types.literal(DashboardTaskBorrowerEntityType.corporation),
        types.literal(DashboardTaskBorrowerEntityType.individual),
        types.literal(DashboardTaskBorrowerEntityType.limited_company),
        types.literal(
          DashboardTaskBorrowerEntityType.limited_liability_company,
        ),
        types.literal(DashboardTaskBorrowerEntityType.limited_partnership),
      ),
    ),
    entityState: types.maybe(types.string),
    signatoryTitle: types.maybe(types.string),
    stateId: types.maybe(types.union(types.string, types.number)),
    trustName: types.maybe(types.string),
    entityName: types.maybe(types.string),
    citizenship: types.maybe(
      types.union(
        types.literal(CommonBorrowerType.us_citizen),
        types.literal(CommonBorrowerType.foreign_national),
        types.literal(CommonBorrowerType.permanent_resident_alien),
      ),
    ),
    firstName: types.string,
    lastName: types.string,
    dateOfBirth: types.maybeNull(types.union(types.Date, types.string)),
    phoneNumber: types.string,
    email: types.string,
    address: Address,
    ssn: types.string,
    isSkipCheck: types.maybe(types.boolean),
    inputCreditScore: types.maybe(types.number),
    authorizedCreditCheck: types.boolean,
    creditScore: types.maybe(types.number),
    errors: types.optional(
      types.model({
        citizenship: types.maybe(types.array(types.string)),
        firstName: types.maybe(types.array(types.string)),
        lastName: types.maybe(types.array(types.string)),
        dateOfBirth: types.maybe(types.array(types.string)),
        phoneNumber: types.maybe(types.array(types.string)),
        email: types.maybe(types.array(types.string)),
        ssn: types.maybe(types.array(types.string)),
        inputCreditScore: types.maybe(types.array(types.string)),
      }),
      {},
    ),
    isValid: types.boolean,
  })
  .views((self) => ({
    get checkPersonalValueIsEmpty() {
      return [
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        'dateOfBirth',
      ].some((item) => !self[item as keyof typeof self]);
    },
    get checkSelfValueIsDisabled() {
      if (!self.borrowerType) {
        return true;
      }

      const conditionForeign =
        this.checkPersonalValueIsEmpty || !self.address.checkAddressValid;

      const conditionLocal =
        this.checkPersonalValueIsEmpty ||
        !self.ssn ||
        !self.address.checkAddressValid;

      const conditionTrust = !self.trustName || !self.signatoryTitle;
      const conditionEntity =
        !self.entityName ||
        !self.entityState ||
        !self.entityType ||
        !self.signatoryTitle ||
        !self.stateId;

      switch (self.borrowerType) {
        case DashboardTaskBorrowerType.entity: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            if (!self.isSkipCheck) {
              return (
                conditionForeign ||
                conditionEntity ||
                !self.authorizedCreditCheck
              );
            }
            return conditionLocal || conditionEntity || !self.inputCreditScore;
          }
          return (
            conditionForeign || conditionEntity || !self.authorizedCreditCheck
          );
        }
        case DashboardTaskBorrowerType.trust: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            if (!self.isSkipCheck) {
              return (
                conditionForeign ||
                conditionTrust ||
                !self.authorizedCreditCheck
              );
            }
            return conditionLocal || conditionTrust || !self.inputCreditScore;
          }
          return (
            conditionForeign || conditionTrust || !self.authorizedCreditCheck
          );
        }
        case DashboardTaskBorrowerType.individual: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            if (!self.isSkipCheck) {
              return conditionForeign || !self.authorizedCreditCheck;
            }
            return conditionLocal || !self.inputCreditScore;
          }
          return conditionForeign || !self.authorizedCreditCheck;
        }
        default:
          return true;
      }
    },
    get checkOtherValueIsDisabled() {
      if (!self.borrowerType) {
        return true;
      }

      const conditionForeign =
        this.checkPersonalValueIsEmpty || !self.address.checkAddressValid;

      const conditionLocal =
        this.checkPersonalValueIsEmpty ||
        !self.ssn ||
        !self.address.checkAddressValid;

      const conditionTrust = !self.trustName || !self.signatoryTitle;
      const conditionEntity =
        !self.entityName ||
        !self.entityState ||
        !self.entityType ||
        !self.signatoryTitle ||
        !self.stateId;

      switch (self.borrowerType) {
        case DashboardTaskBorrowerType.entity: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            return conditionEntity || conditionLocal;
          }
          return conditionEntity || conditionForeign;
        }
        case DashboardTaskBorrowerType.trust: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            return conditionTrust || conditionLocal;
          }
          return conditionTrust || conditionForeign;
        }
        case DashboardTaskBorrowerType.individual: {
          if (self.citizenship !== CommonBorrowerType.foreign_national) {
            return conditionLocal;
          }
          return conditionForeign;
        }
        default:
          return true;
      }
    },
    get checkInfoValid() {
      if (
        Object.keys(self.errors).every(
          (item) => !self.errors[item as keyof typeof self.errors],
        )
      ) {
        return self.address.isValid && self.authorizedCreditCheck;
      }
      return false;
    },
  }))
  .actions((self) => {
    return {
      changeSelfInfo<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
        if (key === 'firstName' || key === 'lastName') {
          self[key] = (value as string).replace(/^./, (match) =>
            match.toUpperCase(),
          ) as typeof value;
        }
      },
      validateSelfInfo(role: 'self' | 'coBorrower' = 'self') {
        let errors = validate(self, CreditScoreSchema.selfInfo);
        console.log(errors);
        if (
          !self.isSkipCheck &&
          !self.authorizedCreditCheck &&
          role === 'self'
        ) {
          if (errors === void 0) {
            errors = {};
          }
          errors.authorizedCreditCheck = [''];
        }
        self.isValid = !errors;
        self.errors = errors || {};
      },
      getPostData(): Omit<Variable<SelfInfoData>, 'name'> {
        const {
          firstName,
          lastName,
          phoneNumber,
          dateOfBirth,
          ssn,
          authorizedCreditCheck,
          email,
          citizenship,
          isSkipCheck,
          inputCreditScore,
          entityName,
          entityState,
          entityType,
          signatoryTitle,
          stateId,
          trustName,
          borrowerType,
          //address,
        } = self;
        return {
          type: 'json',
          value: {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth: format(dateOfBirth as Date, 'yyyy-MM-dd O'),
            propAddr: self.address.getPostData(),
            ssn,
            authorizedCreditCheck,
            email,
            citizenship,
            isSkipCheck,
            inputCreditScore,
            entityName,
            entityState,
            entityType,
            signatoryTitle,
            stateId,
            trustName,
            borrowerType,
          },
        };
      },
      injectModifyData(value: any) {
        self.citizenship = value.citizenship;
      },
      injectServerData(value: SelfInfoData) {
        const {
          firstName,
          lastName,
          phoneNumber,
          dateOfBirth,
          ssn,
          propAddr,
          authorizedCreditCheck,
          email,
          citizenship,
          isSkipCheck,
          inputCreditScore,
          entityName,
          entityState,
          entityType,
          signatoryTitle,
          stateId,
          trustName,
          borrowerType,
        } = value;
        self.firstName = firstName;
        self.lastName = lastName;
        self.phoneNumber = phoneNumber;
        self.dateOfBirth = new Date(dateOfBirth as string);
        self.ssn = ssn;
        self.email = email;
        self.address.injectServerData(propAddr);
        self.authorizedCreditCheck = authorizedCreditCheck;
        self.citizenship = citizenship;
        self.isSkipCheck = isSkipCheck;
        self.inputCreditScore = inputCreditScore;
        self.borrowerType = borrowerType;
        self.entityState = entityState;
        self.entityName = entityName;
        self.entityState = entityState;
        self.entityType = entityType;
        self.signatoryTitle = signatoryTitle;
        self.stateId = stateId;
        self.trustName = trustName;
      },
      injectAddressData(address: IAddress) {
        const addressSnap: SAddress = getSnapshot(address);
        self.address = cast(addressSnap);
      },
    };
  });

export type SPersonalInfo = SnapshotOut<typeof PersonalInfo>;
export type IPersonalInfo = Instance<typeof PersonalInfo>;

const PersonalIncome = types
  .model({
    salary: types.model({
      baseSalary: types.maybe(types.number),
      overtime: types.maybe(types.number),
      commission: types.maybe(types.number),
      bonus: types.maybe(types.number),
      stock: types.maybe(types.number),
      other: types.maybe(types.number),
    }),
    selfEmployed: types.model({
      annualProfit: types.maybe(types.number),
      annualPaySelf: types.maybe(types.number),
    }),
    other: types.model({
      socialSecurity: types.maybe(types.number),
      pension: types.maybe(types.number),
      disability: types.maybe(types.number),
      monthlyChildSupport: types.maybe(types.number),
      monthlyAlimony: types.maybe(types.number),
      other: types.maybe(types.number),
    }),
  })
  .views((self) => {
    return {
      get totalSalary() {
        const {
          baseSalary = 0,
          overtime = 0,
          commission = 0,
          bonus = 0,
          stock = 0,
          other = 0,
        } = self.salary;
        return baseSalary + overtime + commission + bonus + stock + other;
      },
      get totalSelfEmployedIncome() {
        const { annualPaySelf = 0, annualProfit = 0 } = self.selfEmployed;
        const sum = annualPaySelf + annualProfit / 12;
        return sum % 1 === 0 ? sum : Math.floor(sum);
      },
      get totalOtherIncome() {
        const {
          socialSecurity = 0,
          pension = 0,
          disability = 0,
          monthlyChildSupport = 0,
          monthlyAlimony = 0,
          other = 0,
        } = self.other;
        return Math.floor(
          socialSecurity / 12 +
            pension +
            disability +
            monthlyChildSupport +
            monthlyAlimony +
            other,
        );
      },
      get totalIncome(): number {
        let sum = 0;
        const {
          baseSalary = 0,
          overtime = 0,
          commission = 0,
          bonus = 0,
          stock = 0,
        } = self.salary;
        sum +=
          baseSalary +
          overtime +
          commission +
          bonus +
          stock +
          (self.salary.other || 0);

        const { annualPaySelf = 0, annualProfit = 0 } = self.selfEmployed;
        sum += annualPaySelf + annualProfit / 12;

        const {
          socialSecurity = 0,
          pension = 0,
          disability = 0,
          monthlyChildSupport = 0,
          monthlyAlimony = 0,
          other = 0,
        } = self.other;
        sum +=
          socialSecurity / 12 +
          pension +
          disability +
          monthlyChildSupport +
          monthlyAlimony +
          other;
        return Math.floor(sum);
      },
    };
  })
  .actions((self) => {
    return {
      changeIncomeField<
        T extends 'salary' | 'selfEmployed' | 'other',
        K extends keyof (typeof self)[T],
      >(incomeType: T, key: K, value: (typeof self)[T][K]): void {
        self[incomeType][key] = value;
      },
      getPostData(
        role: 'self' | 'coBorrower' = 'self',
      ): Variable<SalaryIncomeData | SelfEmployIncomeData | OtherIncomeData>[] {
        const {
          baseSalary: salary,
          overtime,
          commission,
          bonus,
          stock: rsu,
          other: others,
        } = self.salary;
        const { annualProfit: shareProfit, annualPaySelf: selfPay } =
          self.selfEmployed;
        const {
          socialSecurity,
          pension,
          disability,
          monthlyChildSupport: childSupport,
          monthlyAlimony: alimony,
          other,
        } = self.other;
        const isSelf = role === 'self';
        return [
          {
            name: isSelf
              ? VariableName.salaryIncome
              : VariableName.salaryIncomeOfOther,
            type: 'json',
            value: {
              timeunit: 'months',
              salary,
              overtime,
              commission,
              bonus,
              rsu,
              other: others,
            },
          },
          {
            name: isSelf
              ? VariableName.selfEmployIncome
              : VariableName.selfEmployIncomeOfOther,
            type: 'json',
            value: {
              timeunit: 'years',
              shareProfit,
              selfPay,
            },
          },
          {
            name: isSelf
              ? VariableName.otherIncome
              : VariableName.otherIncomeOfOther,
            type: 'json',
            value: {
              timeunit: 'months',
              socialSecurity,
              pension,
              disability,
              childSupport,
              alimony,
              other,
            },
          },
        ];
      },
      injectServerData(salaryType: VariableName, value: IncomeData) {
        switch (salaryType) {
          case VariableName.salaryIncome:
          case VariableName.salaryIncomeOfOther: {
            const { salary, overtime, commission, bonus, rsu, other } =
              value as SalaryIncomeData;
            self.salary.baseSalary = salary;
            self.salary.overtime = overtime;
            self.salary.commission = commission;
            self.salary.bonus = bonus;
            self.salary.stock = rsu;
            self.salary.other = other;
            break;
          }
          case VariableName.selfEmployIncome:
          case VariableName.selfEmployIncomeOfOther: {
            const { shareProfit, selfPay } = value as SelfEmployIncomeData;
            self.selfEmployed.annualPaySelf = selfPay;
            self.selfEmployed.annualProfit = shareProfit;
            break;
          }
          case VariableName.otherIncome:
          case VariableName.otherIncomeOfOther: {
            const {
              socialSecurity,
              pension,
              disability,
              childSupport,
              alimony,
              other,
            } = value as OtherIncomeData;
            self.other.monthlyAlimony = alimony;
            self.other.monthlyChildSupport = childSupport;
            self.other.other = other;
            self.other.socialSecurity = socialSecurity;
            self.other.pension = pension;
            self.other.disability = disability;
            break;
          }
        }
      },
    };
  });

export type SPersonalIncome = SnapshotOut<typeof PersonalIncome>;
export type IPersonalIncome = Instance<typeof PersonalIncome>;

export const CreditScore = types
  .model({
    values: types.model({
      selfInfo: PersonalInfo,
      selfIncome: PersonalIncome,
      coBorrower: types.model({
        hasCoOwners: types.maybe(types.boolean),
        hasCoBorrower: types.maybe(types.boolean),
        readyEnter: types.maybe(types.boolean),
      }),
      coBorrowerRelationship: types.model({
        relationship: types.union(
          types.literal(RelationshipOpt.unmarried),
          types.literal(RelationshipOpt.married),
          types.literal(RelationshipOpt.legallySeparated),
          types.literal(RelationshipOpt.default),
        ),
        liveTogether: types.maybe(types.boolean),
        willLiveTogether: types.maybe(types.boolean),
      }),
      coBorrowerInfo: PersonalInfo,
      coBorrowerIncome: PersonalIncome,
      borrowerDebts: types.array(DebtData),
      coBorrowerDebts: types.array(DebtData),
    }),
    borrowerDebtsTableState: types.maybe(types.boolean),
    borrowerPayoffTableState: types.maybe(types.boolean),
    coBorrowerDebtsTableState: types.maybe(types.boolean),
    coBorrowerPayoffTableState: types.maybe(types.boolean),
    state: types.frozen<CreditScoreState>(),
  })
  .views((self) => {
    return {
      combinedMonthlyIncome: () => {
        return (
          (self.values.selfIncome.totalIncome +
            self.values.coBorrowerIncome.totalIncome) /
          12
        );
      },
      combinedMonthlyDebtPayments: (role: 'self' | 'coBorrower' = 'self') => {
        return self.values[
          role === 'self' ? 'borrowerDebts' : 'coBorrowerDebts'
        ].reduce((sum, debt) => {
          return sum + (debt.payment ?? 0);
        }, 0);
      },
      debtTotalAmount: (role: 'self' | 'coBorrower' = 'self') => {
        const key = role === 'self' ? 'borrowerDebts' : 'coBorrowerDebts';
        const total = self.values[key].reduce(
          (cur, next) => cur + (next.payment ?? 0),
          0,
        );

        return self.values[key].reduce((total, debt) => {
          return debt.disabled ? total - (debt.payment ?? 0) : total;
        }, total);
      },
      reducingMonthlyPayment: (role: 'self' | 'coBorrower' = 'self') => {
        return self.values[
          role === 'self' ? 'borrowerDebts' : 'coBorrowerDebts'
        ].reduce((sum, debt) => {
          return debt.canPayoff ? sum + (debt.payment ?? 0) : sum;
        }, 0);
      },
      get loanBalance() {
        return self.values.borrowerDebts.reduce((sum, debt) => {
          return debt.consolidate ? sum + (debt.payment ?? 0) : sum;
        }, 0);
      },
      currentName(role: 'self' | 'coBorrower' = 'self') {
        const { firstName, lastName } =
          self.values[role === 'self' ? 'selfInfo' : 'coBorrowerInfo'];
        return `${firstName} ${lastName}`;
      },
      get checkCoBorrowerValid() {
        // tips : do not change this logic , because I don't know how to simplify this.
        // this logic is to check whether the coBorrower value is valid.
        const { hasCoOwners, hasCoBorrower, readyEnter } =
          self.values.coBorrower;
        const isBoolean = (val: unknown): boolean => typeof val === 'boolean';
        if (isBoolean(hasCoOwners)) {
          return hasCoOwners
            ? isBoolean(hasCoBorrower)
              ? hasCoBorrower
                ? isBoolean(readyEnter)
                : true
              : false
            : true;
        }
        return false;
      },
      get checkCoBorrowerRelationshipValid() {
        const { relationship, liveTogether, willLiveTogether } =
          self.values.coBorrowerRelationship;
        const isBoolean = (val: unknown): boolean => typeof val === 'boolean';
        return relationship
          ? isBoolean(liveTogether) && isBoolean(willLiveTogether)
          : false;
      },
      get checkMRCoBorrowerRelationshipValid() {
        const { relationship, liveTogether } =
          self.values.coBorrowerRelationship;
        const isBoolean = (val: unknown): boolean => typeof val === 'boolean';
        return relationship ? isBoolean(liveTogether) : false;
      },
      get checkBorrowerDebtsTableValid() {
        return self.borrowerDebtsTableState ||
          self.values.borrowerDebts.some((item) => item.disabled)
          ? self.values.borrowerDebts.every((item) =>
              item.disabled ? !!item.wrongReason : true,
            )
          : false;
      },
      get checkCoBorrowerDebtsTableValid() {
        return self.coBorrowerDebtsTableState ||
          self.values.coBorrowerDebts.some((item) => item.disabled)
          ? self.values.coBorrowerDebts.every((item) =>
              item.disabled ? !!item.wrongReason : true,
            )
          : false;
      },
      get checkBorrowerPayoffTableValid() {
        return (
          self.borrowerPayoffTableState ||
          self.values.borrowerDebts.some((item) => item.canPayoff)
        );
      },
      get checkCoBorrowerPayoffTableValid() {
        return (
          self.coBorrowerPayoffTableState ||
          self.values.coBorrowerDebts.some((item) => item.canPayoff)
        );
      },
      get checkIsHaveDebts() {
        return self.values.borrowerDebts.every((item) => item.wrongReason);
      },
      get checkCoBorrowerIsHaveDebts() {
        return self.values.coBorrowerDebts.every((item) => item.wrongReason);
      },
    };
  })
  .actions((self) => ({
    changeState(state: (typeof self)['state']) {
      self.state = state;
    },
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    changeCoBorrowerField(
      key: 'hasCoOwners' | 'hasCoBorrower' | 'readyEnter',
      value: boolean,
    ) {
      self.values.coBorrower[key] = value;
    },
    changeCoBorrowerRelationshipField<T extends boolean & RelationshipOpt>(
      key: 'relationship' | 'liveTogether' | 'willLiveTogether',
      value: T,
    ) {
      self.values.coBorrowerRelationship[key] = value;
    },
    setDebts(
      debts: BorrowerDebtRecordData & BorrowerDebtSummaryData,
      role: 'self' | 'coBorrower' = 'self',
    ) {
      const temp = Object.keys(debts.payments)
        .map((key) => {
          const {
            balance,
            paymentSchedule,
            id,
            payment,
            receiver,
            consolidate,
            canPayoff = false,
            disabled = false,
            wrongReason = DebtWrongReasonOpt.default,
          } = debts.payments[key];
          return {
            id,
            receiver,
            balance,
            paymentSchedule,
            payment,
            canPayoff,
            disabled,
            wrongReason,
            consolidate,
          };
        })
        .filter((item) => (item.balance ?? 0) > 0);

      self.values[role === 'self' ? 'borrowerDebts' : 'coBorrowerDebts'] =
        cast(temp);
      self.borrowerPayoffTableState = false;
      self.coBorrowerPayoffTableState = false;
      // get borrowerDebt state
      self.borrowerDebtsTableState = !self.values.borrowerDebts.some(
        (item) => item.disabled,
      );
      self.coBorrowerDebtsTableState = !self.values.coBorrowerDebts.some(
        (item) => item.disabled,
      );
    },
    getDebtsPostData(
      role: 'self' | 'coBorrower' = 'self',
    ): Variable<BorrowerDebtRecordData & BorrowerDebtSummaryData> {
      const payments: {
        [key: string]: MortgageRecordDebtData;
      } = {};
      self.values[
        role === 'self' ? 'borrowerDebts' : 'coBorrowerDebts'
      ].forEach((debt) => {
        const {
          id,
          receiver,
          balance,
          payment,
          paymentSchedule,
          disabled,
          canPayoff,
          wrongReason,
        } = debt;
        payments[id] = {
          id,
          disabled,
          canPayoff,
          wrongReason,
          receiver,
          balance,
          payment,
          paymentSchedule,
        };
      });
      return {
        name:
          role === 'self'
            ? VariableName.merge_borrowerDebt
            : VariableName.merge_otherDebt,
        type: 'json',
        value: {
          payments,
        },
      };
    },
    injectCoBorrowerRelationshipData: (
      value: MortgageAboutOtherRelationData,
    ) => {
      const {
        isOnTheTitle,
        isCoBorrower,
        relationshipOpt,
        togetherCurrently,
        togetherInNewHome,
        readyEnter,
      } = value;
      self.values.coBorrower.hasCoOwners = isOnTheTitle;
      self.values.coBorrower.hasCoBorrower = isCoBorrower;
      self.values.coBorrowerRelationship.relationship = relationshipOpt;
      self.values.coBorrowerRelationship.liveTogether = togetherCurrently;
      self.values.coBorrowerRelationship.willLiveTogether = togetherInNewHome;
      self.values.coBorrower.readyEnter = readyEnter;
    },
    getCoBorrowerRelationPostData:
      (): Variable<MortgageAboutOtherRelationData> => {
        const values = self.values;
        const {
          hasCoOwners: isOnTheTitle,
          hasCoBorrower: isCoBorrower,
          readyEnter,
        } = values.coBorrower;
        const {
          relationship: relationshipOpt,
          liveTogether: togetherCurrently,
          willLiveTogether: togetherInNewHome,
        } = values.coBorrowerRelationship;
        return {
          name: VariableName.aboutOtherRelation,
          type: 'json',
          value: {
            readyEnter,
            isOnTheTitle,
            isCoBorrower,
            relationshipOpt,
            togetherCurrently,
            togetherInNewHome,
          },
        };
      },
  }));

export type ICreditScore = Instance<typeof CreditScore>;
export type SCreditScore = SnapshotOut<typeof CreditScore>;
