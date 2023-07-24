import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';

import { Address, SAddress } from '@/models/common/Address';
import { LoanData, SLoanData } from '@/models/common/LoanData';
import { MortgageFinancialSituation } from '@/models/application/common/MortgageFinancialSitutation';

import validate from 'validate.js';

import {
  PropertyPurposeOpt,
  PropertyTitleOpt,
  WhyRefinanceOpt,
} from '@/types/options';
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
      types.literal(PropertyTitleOpt.byYourself),
      types.literal(PropertyTitleOpt.jointlyWithSpouse),
      types.literal(PropertyTitleOpt.jointlyWithAnotherPerson),
      types.literal(PropertyTitleOpt.default),
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
      const paymentListToMap = payments.reduce((acc: any, cur, index) => {
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
      types.literal(PropertyTitleOpt.byYourself),
      types.literal(PropertyTitleOpt.jointlyWithSpouse),
      types.literal(PropertyTitleOpt.jointlyWithAnotherPerson),
      types.literal(PropertyTitleOpt.default),
    ),
    propertyPurpose: types.union(
      types.literal(PropertyPurposeOpt.default),
      types.literal(PropertyPurposeOpt.secondHome),
      types.literal(PropertyPurposeOpt.investment),
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
        if (propertyPurpose === PropertyPurposeOpt.secondHome) {
          return hasMonthlyPayment ? this.checkLoanListValid : true;
        } else if (propertyPurpose === PropertyPurposeOpt.investment) {
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
    injectAddress(data: SAddress) {
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
      types.literal(WhyRefinanceOpt.default),
      types.literal(WhyRefinanceOpt.lowerPayment),
      types.literal(WhyRefinanceOpt.cashOut),
      types.literal(WhyRefinanceOpt.payoffExist),
      types.literal(WhyRefinanceOpt.consolidateDebts),
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
        case WhyRefinanceOpt.cashOut:
          return !!cashOut && cashValid;
        case WhyRefinanceOpt.consolidateDebts:
          return self.debtValid;
        case WhyRefinanceOpt.lowerPayment:
        case WhyRefinanceOpt.payoffExist:
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
    changeYourPropertyList(data: SMortgageRefinanceYourProperty[]) {
      self.values.yourProperty = cast(data);
    },
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    injectServerData(value: MRYourPropertyData): void {
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
      self.values.yourProperty = cast(temp as any);
    },
    getYourPropertyPostData(): Variable<MRYourPropertyData> {
      const assets: any = {};
      self.values.yourProperty.forEach((item, index) => {
        const {
          propertyTitle,
          propertyPurpose,
          expectRentPrice,
          hasMonthlyPayment,
          payments,
          address: { formatAddress, aptNumber, city, state, postcode },
        } = item;
        const paymentListToMap = payments.reduce((acc: any, cur, index) => {
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
