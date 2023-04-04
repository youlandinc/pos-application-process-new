// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { cast, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/base';
import {
  LoanData,
  MortgageFinancialSituation,
  SLoanData,
} from '@/models/application';
import { Options } from '@/types/options';
import { AssetsState, VariableName } from '@/types/enum';
import {
  MortgageAssetsData,
  MortgagePropertyOwnData,
} from '@/types/application';

export const RealEstate = types
  .model({
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
    changeResidence: types.maybe(types.boolean),
    propertyPlan: types.union(
      types.literal(Options.PropertyPlanOpt.keepIt),
      types.literal(Options.PropertyPlanOpt.sellIt),
      types.literal(Options.PropertyPlanOpt.default),
    ),
    sellForPurchaseNew: types.maybe(types.boolean),
    expectSellPrice: types.maybe(types.number),
    interestedRefinancing: types.maybe(types.boolean),
    isCurrentEstate: types.maybe(types.boolean),
  })
  .actions((self) => {
    return {
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
    };
  })
  .views((self) => {
    return {
      get checkCurrentEstateValid(): boolean {
        const notUndefined = (val: unknown) => typeof val !== 'undefined';
        const {
          isCurrentEstate,
          address: { formatAddress },
          propertyPlan,
          expectSellPrice,
          sellForPurchaseNew,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
          changeResidence,
        } = self;
        if (
          isCurrentEstate &&
          propertyPlan &&
          propertyTitle &&
          formatAddress &&
          notUndefined(hasMonthlyPayment)
        ) {
          if (propertyPlan === Options.PropertyPlanOpt.sellIt) {
            return (
              notUndefined(expectSellPrice) &&
              notUndefined(sellForPurchaseNew) &&
              (hasMonthlyPayment ? this.checkLoanListValid : true)
            );
          } else if (propertyPlan === Options.PropertyPlanOpt.keepIt) {
            return notUndefined(changeResidence) && changeResidence
              ? notUndefined(expectRentPrice) &&
                  (hasMonthlyPayment ? this.checkLoanListValid : true)
              : hasMonthlyPayment
              ? this.checkLoanListValid
              : true;
          }
        }
        return false;
      },
      get checkLoanListValid(): boolean {
        return self.payments.length > 0
          ? self.payments.some((item) => item.isPrimary)
          : false;
      },
      get checkEstateValid(): boolean {
        const notUndefined = (val: unknown) => typeof val !== 'undefined';
        const {
          isCurrentEstate,
          address,
          propertyPurpose,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
        } = self;
        if (!notUndefined(isCurrentEstate) || !address.checkAddressValid) {
          return false;
        }
        if (
          !isCurrentEstate &&
          propertyPurpose &&
          propertyTitle &&
          notUndefined(hasMonthlyPayment)
        ) {
          if (propertyPurpose === Options.PropertyPurposeOpt.secondHome) {
            return hasMonthlyPayment ? this.checkLoanListValid : true;
          } else if (
            propertyPurpose === Options.PropertyPurposeOpt.investment
          ) {
            return (
              notUndefined(expectRentPrice) &&
              (hasMonthlyPayment ? this.checkLoanListValid : true)
            );
          }
        }
        return false;
      },
    };
  });

export type IMPRealEstate = Instance<typeof RealEstate>;
export type SMPRealEstate = SnapshotOut<typeof RealEstate>;

export const MortgagePurchaseAssets = types
  .model({
    currentEstate: RealEstate,
    ownCurrentEstate: types.maybe(types.boolean),
    ownOtherEstate: types.maybe(types.boolean),
    realEstateList: types.array(RealEstate),
    financialSituation: MortgageFinancialSituation,
    purchasePrice: types.maybe(types.number),
    downPayment: types.maybe(types.number),
    state: types.frozen<AssetsState>(),
    realEstateEditState: types.string,
    everOwnedEstate: types.maybe(types.boolean),
    propertyPriceValid: types.boolean,
  })
  .views((self) => ({
    get currentEstateStateValid() {
      if (typeof self.ownCurrentEstate === 'undefined') {
        return false;
      }
      return self.ownCurrentEstate
        ? self.currentEstate.checkCurrentEstateValid
        : typeof self.ownOtherEstate === 'boolean';
    },
    get downPaymentRate(): number {
      if (!self.purchasePrice || !self.downPayment) {
        return 0;
      }
      return self.downPayment / (self.purchasePrice || self.downPayment);
    },
    get loanAmount() {
      if (!self.purchasePrice || !self.downPayment) {
        return 0;
      }
      return self.purchasePrice - self.downPayment;
    },
  }))
  .actions((self) => {
    return {
      changeState(state: typeof self.state) {
        self.state = state;
      },
      changeRealEstateList(data: SMPRealEstate[]) {
        self.realEstateList = cast(data);
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
      injectPropertyData(value: MortgagePropertyOwnData) {
        const { assets, ownCurrentEstate, ownOtherEstate } = value;
        const realEstateList = [];
        for (const idx in assets) {
          if (assets[idx].isCurrentEstate) {
            self.currentEstate = cast(this.parsePostDataToLocal(assets[idx]));
          }
          realEstateList.push(this.parsePostDataToLocal(assets[idx]));
        }
        self.realEstateList = cast(realEstateList);
        self.ownCurrentEstate = ownCurrentEstate;
        self.ownOtherEstate = ownOtherEstate;
      },
      getPostData(): Variable<MortgagePropertyOwnData> {
        const realEstateList = self.realEstateList;
        const assets = {};
        realEstateList.forEach((realEstate, idx) => {
          assets[idx] = { ...this.genPrueData(realEstate) };
        });
        return {
          name: VariableName.propertyOwn,
          type: 'json',
          value: {
            assets,
            ownCurrentEstate: self.ownCurrentEstate,
            ownOtherEstate: self.ownOtherEstate,
            everOwnedEstate: self.everOwnedEstate,
          },
        };
      },
      addCurrentEstateToList() {
        const { realEstateList } = self;
        const temp = [];
        realEstateList.forEach((item) => {
          if (!item.isCurrentEstate) {
            temp.push(this.parsePostDataToLocal(this.genPrueData(item)));
          }
        });
        temp.push(
          this.parsePostDataToLocal(this.genPrueData(self.currentEstate)),
        );
        self.realEstateList = cast(temp);
      },
      removeCurrentEstateFromList() {
        const { realEstateList } = self;
        const temp = [];
        realEstateList.forEach((item) => {
          if (!item.isCurrentEstate) {
            temp.push(this.parsePostDataToLocal(this.genPrueData(item)));
          }
        });
        self.realEstateList = cast(temp);
      },
      genPrueData(estate: IMPRealEstate): MortgageAssetsData {
        const {
          isCurrentEstate,
          address: { formatAddress: address, aptNumber, state, city, postcode },
          propertyPlan,
          expectSellPrice,
          sellForPurchaseNew,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
          changeResidence,
          payments,
          propertyPurpose,
          interestedRefinancing,
        } = estate;
        const temp = {};
        payments.forEach((loan, loanIdx) => {
          const { caption, balance, payment, isPrimary, includedTaxAndIns } =
            loan;
          temp[loanIdx] = {
            caption,
            balance,
            payment,
            isPrimary,
            includedTaxAndIns,
          };
        });

        return {
          isCurrentEstate,
          propAddr: {
            address,
            aptNumber,
            state,
            city,
            postcode,
          },
          propertyPlan,
          expectSellPrice,
          sellForPurchaseNew,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
          payments: temp,
          propertyPurpose,
          interestedRefinancing,
          changeResidence,
        };
      },
      parsePostDataToLocal(AssetsData): SMPRealEstate {
        const {
          isCurrentEstate,
          propAddr: { address, aptNumber, state, city, postcode },
          propertyPlan,
          expectSellPrice,
          sellForPurchaseNew,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
          propertyPurpose,
          payments,
          interestedRefinancing,
          changeResidence,
        } = AssetsData;
        return {
          isCurrentEstate,
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
          propertyPlan,
          sellForPurchaseNew,
          expectSellPrice,
          expectRentPrice,
          propertyTitle,
          hasMonthlyPayment,
          interestedRefinancing,
          changeResidence,
          payments: Object.keys(payments).map((key) => {
            const { isPrimary, balance, payment, includedTaxAndIns, caption } =
              payments[key];
            return {
              caption,
              balance,
              payment,
              isPrimary,
              includedTaxAndIns,
            };
          }),
        };
      },
    };
  });

export type IMortgagePurchaseAssets = Instance<typeof MortgagePurchaseAssets>;
export type SMortgagePurchaseAssets = SnapshotOut<
  typeof MortgagePurchaseAssets
>;
