import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FREstimateRateData } from '@/types/application/fix';

import { VariableName } from '@/types/enum';

export const FixRefinanceEstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
    homeValue: types.maybe(types.number),
    balance: types.maybe(types.number),
    isCashOut: types.maybe(types.boolean),
    cashOutAmount: types.maybe(types.number),
    cor: types.maybe(types.number),
    arv: types.maybe(types.number),

    customRate: types.maybe(types.boolean),
    loanTerm: types.maybe(types.number),
    interestRate: types.maybe(types.number),

    lenderPoints: types.maybe(types.number),
    lenderProcessingFee: types.maybe(types.number),
    brokerPoints: types.maybe(types.number),
    brokerProcessingFee: types.maybe(types.number),
    officerPoints: types.maybe(types.number),
    officerProcessingFee: types.maybe(types.number),
    agentFee: types.maybe(types.number),
  })
  .views(() => ({
    get checkIsValid() {
      return true;
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      self[key] = value;
    },
    getPostData(): Variable<FREstimateRateData> {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        cor,
        arv,
        closeDate,

        customRate,
        loanTerm,
        interestRate,

        lenderPoints,
        lenderProcessingFee,
        brokerPoints,
        brokerProcessingFee,
        officerPoints,
        officerProcessingFee,
        agentFee,
      } = self;

      return {
        name: VariableName.estimateRate,
        type: 'json',
        value: {
          homeValue,
          balance,
          isCashOut: isCashOut as boolean,
          cashOutAmount,
          cor,
          arv,
          closeDate,

          customRate,
          loanTerm,
          interestRate,

          lenderPoints,
          lenderProcessingFee,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        },
      };
    },
    injectModifyData(data: any) {
      self.homeValue = data.homeValue;
      self.balance = data.balance;
      self.isCashOut = data.isCashOut;
      self.cashOutAmount = data.cashOutAmount;
      self.cor = data.cor;
      self.arv = data.arv;
    },
    injectServerData(value: FREstimateRateData) {
      const {
        homeValue,
        balance,
        isCashOut,
        cashOutAmount,
        cor,
        arv,
        closeDate,

        customRate,
        loanTerm,
        interestRate,

        lenderPoints,
        lenderProcessingFee,
        brokerPoints,
        brokerProcessingFee,
        officerPoints,
        officerProcessingFee,
        agentFee,
      } = value;

      self.homeValue = homeValue;
      self.balance = balance;
      self.isCashOut = isCashOut;
      self.cashOutAmount = cashOutAmount;
      self.cor = cor;
      self.arv = arv;
      self.closeDate = closeDate as unknown as null;

      self.customRate = customRate;
      self.loanTerm = loanTerm;
      self.interestRate = interestRate;

      self.agentFee = agentFee;
      self.lenderPoints = lenderPoints;
      self.lenderProcessingFee = lenderProcessingFee;
      self.brokerPoints = brokerPoints;
      self.brokerProcessingFee = brokerProcessingFee;
      self.officerPoints = officerPoints;
      self.officerProcessingFee = officerProcessingFee;
    },
  }));

export type IFixRefinanceEstimateRate = Instance<
  typeof FixRefinanceEstimateRate
>;
export type SFixRefinanceEstimateRate = SnapshotOut<
  typeof FixRefinanceEstimateRate
>;
