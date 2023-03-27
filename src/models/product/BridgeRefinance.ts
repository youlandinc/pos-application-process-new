import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import {
  BCreditScore,
  BREstimateRate,
  BStarting,
} from '@/models/modules/application/bridge';
import { WhereKnowUs } from '@/models/modules/WhereKnowUs';
import { DenialReason } from '@/types/options';
import { BridgeRefinanceState, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';
import {
  BApplicationProcessSnapshot,
  BorrowerData,
  BREstimateRateData,
  BridgeStartingData,
  SelfInfoData,
  VariableValue,
  WhereKnowUsData,
} from '@/types/variable';
import { IApplicationForm } from '@/models/ApplicationForm';

export const BridgeRefinance = types
  .model({
    name: 'BridgeRefinance',
    starting: BStarting,
    creditScore: BCreditScore,
    whereKnowUs: WhereKnowUs,
    estimateRate: BREstimateRate,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<DenialReason>()),
    state: types.frozen<BridgeRefinanceState>(),
  })
  .actions((self) => ({
    changeState(state: BridgeRefinanceState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: DenialReason) {
      self.preApproved = preApproved;
      self.denialReason = denialReason;
    },
    getApplicationProgressSnapshot(): BApplicationProcessSnapshot {
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
    setClientState(clientAppProgress: BApplicationProcessSnapshot) {
      const { state, creditScore, starting } = clientAppProgress;
      self.state = state as BridgeRefinanceState;
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
            const value = variable.value as BREstimateRateData;
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

export type IBridgeRefinance = Instance<typeof BridgeRefinance>;
export type SBridgeRefinance = SnapshotIn<typeof BridgeRefinance>;
