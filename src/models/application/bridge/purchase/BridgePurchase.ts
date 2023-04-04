import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { Options } from '@/types/options';
import { BridgePurchaseState, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';

import {
  BorrowerData,
  BPEstimateRateData,
  BridgeApplicationProcessSnapshot,
  BridgeStartingData,
  SelfInfoData,
  WhereKnowUsData,
} from '@/types/application';
import { VariableValue } from '@/types';
import {
  BPEstimateRate,
  BridgeCreditScore,
  BridgeStarting,
} from '@/models/application/bridge';
import { IApplicationForm, WhereKnowUs } from '@/models/application';

export const BridgePurchase = types
  .model({
    name: 'BridgePurchase',
    starting: BridgeStarting,
    creditScore: BridgeCreditScore,
    whereKnowUs: WhereKnowUs,
    estimateRate: BPEstimateRate,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<Options.DenialReason>()),
    state: types.frozen<BridgePurchaseState>(),
  })
  .actions((self) => ({
    changeState(state: BridgePurchaseState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: Options.DenialReason) {
      self.preApproved = preApproved;
      self.denialReason = denialReason;
    },
    getApplicationProgressSnapshot(): BridgeApplicationProcessSnapshot {
      const { state } = self;
      const { applicationType, productCategory } = getParent<IApplicationForm>(
        self,
        1,
      );
      return {
        applicationType,
        productCategory,
        starting: {
          state: self.starting.state,
        },
        creditScore: {
          state: self.creditScore.state,
        },
        state,
      };
    },
    setClientState(clientAppProgress: BridgeApplicationProcessSnapshot) {
      const { state, creditScore, starting } = clientAppProgress;
      self.state = state as BridgePurchaseState;
      self.starting.state = starting.state;
      self.creditScore.state = creditScore.state;
    },
    injectClientData(variables: Variable<VariableValue>[]) {
      variables.forEach((variable) => {
        switch (variable.name as VariableName) {
          case VariableName.starting: {
            const value = variable.value as BridgeStartingData;
            self.starting.injectServerData(value);
            break;
          }
          case VariableName.aboutUSelf: {
            const value = variable.value as SelfInfoData;
            self.creditScore.selfInfo.injectServerData(value);
            break;
          }
          case VariableName._borrower: {
            const value = variable.value as BorrowerData;
            const { creditScore, preApproved = false, denialReason } = value;
            self.creditScore.selfInfo.creditScore = creditScore;
            self.preApproved = preApproved;
            self.denialReason = denialReason;
            break;
          }
          case VariableName.whereKnowUs: {
            const value = variable.value as WhereKnowUsData;
            self.whereKnowUs.injectServerData(value);
            break;
          }
          case VariableName.estimateRate: {
            const value = variable.value as BPEstimateRateData;
            self.estimateRate.injectServerData(value);
            break;
          }
        }
      });
    },
    loadProcessData(processData: ProcessData) {
      const { extra } = processData;
      const variables = extra.variables;
      // load task data
      this.injectClientData(variables);
    },
  }));

export type IBridgePurchase = Instance<typeof BridgePurchase>;
export type SBridgePurchase = SnapshotIn<typeof BridgePurchase>;
