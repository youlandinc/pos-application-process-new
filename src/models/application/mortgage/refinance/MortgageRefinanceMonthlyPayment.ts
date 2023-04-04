// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  cast,
  getSnapshot,
  Instance,
  SnapshotIn,
  types,
} from 'mobx-state-tree';
import { MRMonthlyPaymentData } from '@/types/application';
import { LoanType, VariableName } from '@/types/enum';

export const PaymentLoan = types.model({
  caption: types.maybe(types.string),
  balance: types.maybe(types.number),
  payment: types.maybe(types.number),
  isPrimary: types.maybe(types.boolean),
  includedTaxAndIns: types.maybe(types.boolean),
  refinance: types.maybe(types.boolean),
  loanRate: types.maybe(types.number),
  loanType: types.maybe(
    types.union(
      types.literal(LoanType.UNCATEGORIZED),
      types.literal(LoanType.ADJUSTABLE_51),
      types.literal(LoanType.ADJUSTABLE_71),
      types.literal(LoanType.FIXED_YEAR_5),
      types.literal(LoanType.FIXED_YEAR_10),
      types.literal(LoanType.FIXED_YEAR_15),
      types.literal(LoanType.FIXED_YEAR_20),
      types.literal(LoanType.FIXED_YEAR_25),
      types.literal(LoanType.FIXED_YEAR_30),
    ),
  ),
});

export type IMortgageRefinancePaymentLoan = Instance<typeof PaymentLoan>;
export type SMortgageRefinancePaymentLoan = SnapshotIn<typeof PaymentLoan>;

export const MortgageRefinanceMonthlyPayment = types
  .model({
    hasMonthlyPayment: types.maybe(types.boolean),
    aboutYourLoans: types.array(PaymentLoan),
  })
  .views((self) => ({
    get checkIsValid() {
      if (typeof self.hasMonthlyPayment === 'undefined') {
        return false;
      }
      return self.hasMonthlyPayment
        ? self.aboutYourLoans.some((item) => item.isPrimary === true)
        : true;
    },
  }))
  .actions((self) => ({
    changeFieldValue<K extends keyof typeof self>(
      key: K,
      value: (typeof self)[K],
    ) {
      self[key] = value;
    },
    updateLoanList(paymentData: SMortgageRefinancePaymentLoan, idx: number) {
      if (paymentData.isPrimary) {
        self.aboutYourLoans.forEach((loan, index) => {
          if (index !== idx) {
            loan.isPrimary = false;
          }
        });
      }
      self.aboutYourLoans.splice(idx, 1, paymentData);
    },
    addLoan(paymentData: SMortgageRefinancePaymentLoan) {
      if (paymentData.isPrimary) {
        self.aboutYourLoans.forEach((loan) => {
          loan.isPrimary = false;
        });
      }
      self.aboutYourLoans.push(paymentData);
    },
    deleteLoan(idx: number) {
      self.aboutYourLoans.splice(idx, 1);
    },
    injectServerData(value: MRMonthlyPaymentData) {
      const { hasMonthlyPayment, aboutYourLoans } = value;
      const temp = [];
      self.hasMonthlyPayment = hasMonthlyPayment;
      Object.keys(aboutYourLoans).forEach((key) => {
        temp.push(aboutYourLoans[key]);
      });
      self.aboutYourLoans = cast(temp);
    },
    getPostData(): Variable<MRMonthlyPaymentData> {
      const { hasMonthlyPayment } = self;
      const aboutYourLoans = {};
      const temp = self.aboutYourLoans;
      temp.forEach((item, idx) => {
        aboutYourLoans[idx] = { ...getSnapshot(item) };
      });
      return {
        name: VariableName.monthlyPayment,
        type: 'json',
        value: {
          hasMonthlyPayment,
          aboutYourLoans,
        },
      };
    },
  }));

export type IMortgageRefinanceMonthlyPayment = Instance<
  typeof MortgageRefinanceMonthlyPayment
>;
export type SMortgageRefinanceMonthlyPayment = SnapshotIn<
  typeof MortgageRefinanceMonthlyPayment
>;
