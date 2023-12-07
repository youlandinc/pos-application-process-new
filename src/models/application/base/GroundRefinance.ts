import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { IApplicationForm } from '@/models/base/ApplicationForm';
import { WhereKnowUs } from '@/models/application/common/WhereKnowUs';
import {
  GroundCreditScore,
  GroundRefinanceEstimateRate,
  GroundStarting,
} from '@/models/application/ground';

import { DenialReason } from '@/types/options';
import { GroundUpConstructionRefinanceState, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';
import {
  BorrowerData,
  GREstimateRateData,
  GroundApplicationProcessSnapshot,
  GroundCoBorrowerCondition,
  GroundStartingData,
  SelfInfoData,
  WhereKnowUsData,
} from '@/types/application';
import { VariableValue } from '@/types';

export const GroundRefinance = types
  .model({
    name: 'GroundUpConstructionRefinance',
    starting: GroundStarting,
    creditScore: GroundCreditScore,
    whereKnowUs: WhereKnowUs,
    estimateRate: GroundRefinanceEstimateRate,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<DenialReason>()),
    state: types.frozen<GroundUpConstructionRefinanceState>(),
  })
  .actions((self) => ({
    changeState(state: GroundUpConstructionRefinanceState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: DenialReason) {
      self.preApproved = preApproved;
      self.denialReason = denialReason;
    },
    getApplicationProgressSnapshot(): GroundApplicationProcessSnapshot {
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
    setClientState(clientAppProgress: GroundApplicationProcessSnapshot) {
      const { state, creditScore, starting } = clientAppProgress;
      self.state = state as GroundUpConstructionRefinanceState;
      self.starting.state = starting.state;
      self.creditScore.state = creditScore.state;
    },
    injectClientData(variables: Variable<VariableValue>[]) {
      variables.forEach((variable) => {
        switch (variable.name as VariableName) {
          case VariableName.starting: {
            const value = variable.value as GroundStartingData;
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
          case VariableName.aboutOtherCondition: {
            const value = variable.value as GroundCoBorrowerCondition;
            self.creditScore.injectServerData(value);
            break;
          }
          case VariableName.aboutOtherInfo: {
            const value = variable.value as SelfInfoData;
            self.creditScore.coBorrowerInfo.injectServerData(value);
            break;
          }
          case VariableName._otherPerson: {
            const value = variable.value as BorrowerData;
            const { creditScore, preApproved = false, denialReason } = value;
            self.creditScore.coBorrowerInfo.creditScore = creditScore;
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
            const value = variable.value as GREstimateRateData;
            self.estimateRate.injectServerData(value);
            break;
          }
        }
      });
    },
    loadProcessData(processData: ProcessData) {
      const { extra, modifyVariables } = processData;
      const variables = extra.variables;
      const value = modifyVariables?.value;
      // load modify data
      if (value) {
        value.forEach((item: any) => {
          switch (item.name as VariableName) {
            case VariableName.starting:
              self.starting.injectModifyData(item.value);
              break;
            case VariableName.aboutUSelf:
              self.creditScore.selfInfo.injectModifyData(item.value);
              break;
            case VariableName.estimateRate:
              self.estimateRate.injectModifyData(item.value);
              break;
          }
        });
      }
      // load task data
      this.injectClientData(variables);
    },
  }));

export type IGroundRefinance = Instance<typeof GroundRefinance>;
export type SGroundRefinance = SnapshotIn<typeof GroundRefinance>;
