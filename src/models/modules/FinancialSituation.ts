import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FinancialSituationData } from '@/types/variable';
import { VariableName } from '@/types/enum';

export const FinancialSituation = types
  .model({
    savingAccount: types.maybe(types.number),
    retirementAccount: types.maybe(types.number),
    stockAndBonds: types.maybe(types.number),
    giftFromRelative: types.maybe(types.number),
    loanAmount: types.maybe(types.number),
    salesOfRealEstate: types.maybe(types.number),
    other: types.maybe(types.number),
  })
  .actions((self) => {
    return {
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: typeof self[K],
      ) {
        self[key] = value;
      },
      getPostData(): Variable<FinancialSituationData> {
        const {
          savingAccount,
          retirementAccount,
          stockAndBonds,
          giftFromRelative,
          loanAmount,
          other,
          salesOfRealEstate,
        } = self;
        return {
          name: VariableName.financialSituation,
          type: 'json',
          value: {
            giftFromRelative,
            loanAmount,
            other,
            retirementAccount,
            salesOfRealEstate,
            savingAccount,
            stockAndBonds,
          },
        };
      },
      injectServerData(value: FinancialSituationData) {
        const {
          savingAccount,
          retirementAccount,
          stockAndBonds,
          giftFromRelative,
          loanAmount,
          other,
          salesOfRealEstate,
        } = value;
        self.savingAccount = savingAccount;
        self.retirementAccount = retirementAccount;
        self.stockAndBonds = stockAndBonds;
        self.giftFromRelative = giftFromRelative;
        self.loanAmount = loanAmount;
        self.other = other;
        self.salesOfRealEstate = salesOfRealEstate;
      },
    };
  })
  .views((self) => {
    return {
      get totalAmount(): number {
        const {
          savingAccount = 0,
          retirementAccount = 0,
          stockAndBonds = 0,
          loanAmount = 0,
          salesOfRealEstate = 0,
          giftFromRelative = 0,
          other = 0,
        } = self;
        return (
          salesOfRealEstate +
          retirementAccount +
          stockAndBonds +
          savingAccount +
          loanAmount +
          giftFromRelative +
          other
        );
      },
    };
  });

export type IMPFinancialSituation = Instance<typeof FinancialSituation>;
export type SMPFinancialSituation = SnapshotOut<typeof FinancialSituation>;
