// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import validate from 'validate.js';
import { Address } from '@/models/base';
import {
  LoanData,
  MortgageFinancialSituation,
  SLoanData,
} from '@/models/application';
import { Options } from '@/types/options';
import { MortgageRefinanceAssetsState, VariableName } from '@/types/enum';
import {
  MRResidenceOwnData,
  MRWhyRefinanceData,
  MRYourPropertyData,
} from '@/types/application';

export const MortgageRefinanceResidenceOwn = types
  .model({
    ownCurrentEstate: types.maybe(types.boolean),
    hasMonthlyPayment: types.maybe(types.boolean),
    payments: types.array(LoanData),
    propertyTitle: types.union(
      types.literal(Options.PropertyTitleOpt.byYourself),
      types.literal(Options.PropertyTitleOpt.jointlyWithSpouse),
      types.literal(Options.PropertyTitleOpt.jointlyWithAnotherPerson),
      types.literal(Options.PropertyTitleOpt.default),
    ),
  })
  .views((self) => ({
    get checkLoanListValid(): boolean {
      return self.payments.length > 0
        ? self.payments.some((item) => item.isPrimary)
        : false;
    },
    get checkIsValid() {
      if (!validate.isBoolean(self.ownCurrentEstate)) {
        return false;
      }
      if (!self.ownCurrentEstate) {
        return true;
      }
      const condition =
        !!self.propertyTitle && validate.isBoolean(self.hasMonthlyPayment);
      return condition
        ? self.hasMonthlyPayment
          ? this.checkLoanListValid
          : condition
        : condition;
    },
  }))
  .actions((self) => ({
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    updateLoanList(loanData: SLoanData, idx: number) {
      if (loanData.isPrimary) {
        self.payments.forEach((loan, index) => {
          if (index !== idx) {
            loan.isPrimary = false;
          }
        });
      }
      self.payments.splice(idx, 1, loanData);
    },
    addLoan(loanData: SLoanData) {
      if (loanData.isPrimary) {
        self.payments.forEach((loan) => {
          loan.isPrimary = false;
        });
      }
      self.payments.push(loanData);
    },
    deleteLoan(idx: number) {
      self.payments.splice(idx, 1);
    },
    getPostData(): Variable<MRResidenceOwnData> {
      const { ownCurrentEstate, hasMonthlyPayment, payments, propertyTitle } =
        self;
      const paymentListToMap = payments.reduce((acc, cur, index) => {
        acc[index] = getSnapshot(cur);
        return acc;
      }, {});
      return {
        name: VariableName.residenceOwn,
        type: 'json',
        value: {
          ownCurrentEstate,
          hasMonthlyPayment,
          payments: paymentListToMap,
          propertyTitle,
        },
      };
    },
    injectServerData(value: MRResidenceOwnData) {
      const { ownCurrentEstate, hasMonthlyPayment, propertyTitle, payments } =
        value;
      const temp = Object.values(payments);
      self.ownCurrentEstate = ownCurrentEstate;
      self.hasMonthlyPayment = hasMonthlyPayment;
      self.propertyTitle = propertyTitle;
      self.payments = cast(temp);
    },
  }));

export type IMRResidenceOwn = Instance<typeof MortgageRefinanceResidenceOwn>;
export type SMRResidenceOwn = SnapshotOut<typeof MortgageRefinanceResidenceOwn>;

export const MortgageRefinanceYourProperty = types
  .model({
    // this is loan monthly payment list
    payments: types.array(LoanData),
    address: Address,
    propertyTitle: types.union(
      types.literal(Options.PropertyTitleOpt.byYourself),
      types.literal(Options.PropertyTitleOpt.jointlyWithSpouse),
      types.literal(Options.PropertyTitleOpt.jointlyWithAnotherPerson),
      types.literal(Options.PropertyTitleOpt.default),
    ),
    propertyPurpose: types.union(
      types.literal(Options.PropertyPurposeOpt.default),
      types.literal(Options.PropertyPurposeOpt.secondHome),
      types.literal(Options.PropertyPurposeOpt.investment),
    ),
    expectRentPrice: types.maybe(types.number),
    hasMonthlyPayment: types.maybe(types.boolean),
  })
  .views((self) => ({
    get checkLoanListValid(): boolean {
      return self.payments.length > 0
        ? self.payments.some((item) => item.isPrimary)
        : false;
    },
    get checkForm() {
      const notUndefined = (val: unknown) => typeof val !== 'undefined';
      const {
        address,
        propertyPurpose,
        expectRentPrice,
        propertyTitle,
        hasMonthlyPayment,
      } = self;
      if (!address.checkAddressValid) {
        return false;
      }
      if (propertyPurpose && propertyTitle && notUndefined(hasMonthlyPayment)) {
        if (propertyPurpose === Options.PropertyPurposeOpt.secondHome) {
          return hasMonthlyPayment ? this.checkLoanListValid : true;
        } else if (propertyPurpose === Options.PropertyPurposeOpt.investment) {
          return (
            notUndefined(expectRentPrice) &&
            (hasMonthlyPayment ? this.checkLoanListValid : true)
          );
        }
      }
      return false;
    },
  }))
  .actions((self) => ({
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    updateLoanList(loanData: SLoanData, idx: number) {
      if (loanData.isPrimary) {
        self.payments.forEach((loan, index) => {
          if (index !== idx) {
            loan.isPrimary = false;
          }
        });
      }
      self.payments.splice(idx, 1, loanData);
    },
    addLoan(loanData: SLoanData) {
      if (loanData.isPrimary) {
        self.payments.forEach((loan) => {
          loan.isPrimary = false;
        });
      }
      self.payments.push(loanData);
    },
    deleteLoan(idx: number) {
      self.payments.splice(idx, 1);
    },
    injectAddress(data) {
      self.address.formatAddress = data.formatAddress;
      self.address.state = data.state;
      self.address.street = data.street;
      self.address.aptNumber = data.aptNumber;
      self.address.city = data.city;
      self.address.postcode = data.postcode;
      self.address.errors = data.errors;
      self.address.isValid = true;
    },
  }));

export type IMortgageRefinanceYourProperty = Instance<
  typeof MortgageRefinanceYourProperty
>;
export type SMortgageRefinanceYourProperty = SnapshotOut<
  typeof MortgageRefinanceYourProperty
>;

const MortgageRefinanceWhyRefinance = types
  .model({
    purpose: types.union(
      types.literal(Options.WhyRefinanceOpt.default),
      types.literal(Options.WhyRefinanceOpt.lowerPayment),
      types.literal(Options.WhyRefinanceOpt.cashOut),
      types.literal(Options.WhyRefinanceOpt.payoffExist),
      types.literal(Options.WhyRefinanceOpt.consolidateDebts),
    ),
    cashOut: types.maybe(types.number),
    // this is report of credit
    hasMonthlyPayment: types.maybe(types.boolean),
    cashValid: types.boolean,
    debtValid: types.boolean,
    totalBalance: types.maybe(types.number),
  })
  .views((self) => ({
    get checkIsValid(): boolean {
      const { purpose, cashOut, cashValid } = self;
      if (!purpose) {
        return false;
      }
      switch (purpose) {
        case Options.WhyRefinanceOpt.cashOut:
          return !!cashOut && cashValid;
        case Options.WhyRefinanceOpt.consolidateDebts:
          return self.debtValid;
        case Options.WhyRefinanceOpt.lowerPayment:
        case Options.WhyRefinanceOpt.payoffExist:
          return (self.totalBalance ?? 0) >= 100000;
        default:
          return false;
      }
    },
  }))
  .actions((self) => ({
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    getPostData(): Variable<MRWhyRefinanceData> {
      const { purpose, cashOut } = self;
      return {
        name: VariableName.whyRefinance,
        type: 'json',
        value: {
          purpose,
          cashOut,
        },
      };
    },
    injectServerData(value: MRWhyRefinanceData) {
      const { purpose, cashOut } = value;
      self.purpose = purpose;
      self.cashOut = cashOut;
    },
  }));

export const MortgageRefinanceAssets = types
  .model({
    values: types.model({
      residenceOwn: MortgageRefinanceResidenceOwn,
      yourProperty: types.array(MortgageRefinanceYourProperty),
      whyRefinance: MortgageRefinanceWhyRefinance,
      financialSituation: MortgageFinancialSituation,
    }),
    estateEditState: types.string,
    state: types.frozen<MortgageRefinanceAssetsState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    changeYourPropertyList(data: SMRYourProperty[]) {
      self.values.yourProperty = cast(data);
    },
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    injectServerData(value: MRYourPropertyData) {
      const { assets } = value;
      const temp = [];
      for (const key in assets) {
        const {
          payments,
          propAddr: { address, aptNumber, city, state, postcode },
          propertyTitle,
          propertyPurpose,
          expectRentPrice,
          hasMonthlyPayment,
        } = assets[key];
        temp.push({
          address: {
            formatAddress: address,
            aptNumber,
            city,
            state,
            postcode,
            street: '',
            errors: undefined,
            isValid: true,
          },
          propertyPurpose,
          propertyTitle,
          expectRentPrice,
          hasMonthlyPayment,
          payments: Object.keys(payments).map((item) => {
            const { isPrimary, balance, payment, includedTaxAndIns, caption } =
              payments[item];
            return {
              caption,
              balance,
              payment,
              isPrimary,
              includedTaxAndIns,
            };
          }),
        });
      }
      self.values.yourProperty = cast(temp);
    },
    getYourPropertyPostData(): Variable<MRYourPropertyData> {
      const assets = {};
      self.values.yourProperty.forEach((item, index) => {
        const {
          propertyTitle,
          propertyPurpose,
          expectRentPrice,
          hasMonthlyPayment,
          payments,
          address: { formatAddress, aptNumber, city, state, postcode },
        } = item;
        const paymentListToMap = payments.reduce((acc, cur, index) => {
          acc[index] = getSnapshot(cur);
          return acc;
        }, {});
        const propAddr = {
          address: formatAddress,
          aptNumber,
          city,
          state,
          postcode,
        };
        assets[index] = {
          propAddr,
          payments: paymentListToMap,
          propertyTitle,
          propertyPurpose,
          expectRentPrice,
          hasMonthlyPayment,
        };
      });
      return {
        name: VariableName.yourProperty,
        type: 'json',
        value: {
          assets,
        },
      };
    },
  }));

export type IMortgageRefinanceAssets = Instance<typeof MortgageRefinanceAssets>;
export type SMortgageRefinanceAssets = SnapshotOut<
  typeof MortgageRefinanceAssets
>;
