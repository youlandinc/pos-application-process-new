import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BPEstimateRateData } from '@/types/application/bridge';

import { VariableName } from '@/types/enum';

export const BPEstimateRate = types
  .model({
    closeDate: types.maybeNull(types.union(types.Date, types.string)),
    purchasePrice: types.maybe(types.number),
    purchaseLoanAmount: types.maybe(types.number),

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
    getPostData(): Variable<BPEstimateRateData> {
      const {
        purchasePrice,
        purchaseLoanAmount,
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
          purchasePrice,
          purchaseLoanAmount,
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
    injectModifyData(value: any) {
      self.purchasePrice = value.purchasePrice;
      self.purchaseLoanAmount = value.purchaseLoanAmount;
    },
    injectServerData(value: BPEstimateRateData) {
      const {
        purchasePrice,
        purchaseLoanAmount,
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
      self.purchaseLoanAmount = purchaseLoanAmount;
      self.purchasePrice = purchasePrice;
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

export type IBPEstimateRate = Instance<typeof BPEstimateRate>;
export type SBPEstimateRate = SnapshotOut<typeof BPEstimateRate>;
