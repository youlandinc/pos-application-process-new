import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { IApplicationForm } from '@/models/base/ApplicationForm';
import { WhereKnowUs } from '@/models/application/common/WhereKnowUs';
import {
  FixCreditScore,
  FixPurchaseEstimateRate,
  FixStarting,
} from '@/models/application/fix';

import { DenialReason } from '@/types/options';
import { FixAndFlipPurchaseState, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';
import {
  BorrowerData,
  FixApplicationProcessSnapshot,
  FixCoBorrowerCondition,
  FixStartingData,
  FPEstimateRateData,
  SelfInfoData,
  WhereKnowUsData,
} from '@/types/application';
import { VariableValue } from '@/types';

export const FixPurchase = types
  .model({
    name: 'FixAndFlipPurchase',
    starting: FixStarting,
    creditScore: FixCreditScore,
    whereKnowUs: WhereKnowUs,
    estimateRate: FixPurchaseEstimateRate,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<DenialReason>()),
    state: types.frozen<FixAndFlipPurchaseState>(),
  })
  .actions((self) => ({
    changeState(state: FixAndFlipPurchaseState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: DenialReason) {
      self.preApproved = preApproved;
      self.denialReason = denialReason;
    },
    getApplicationProgressSnapshot(): FixApplicationProcessSnapshot {
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
    setClientState(clientAppProgress: FixApplicationProcessSnapshot) {
      const { state, creditScore, starting } = clientAppProgress;
      self.state = state as FixAndFlipPurchaseState;
      self.starting.state = starting.state;
      self.creditScore.state = creditScore.state;
    },
    injectClientData(variables: Variable<VariableValue>[]) {
      variables.forEach((variable) => {
        switch (variable.name as VariableName) {
          case VariableName.starting: {
            const value = variable.value as FixStartingData;
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
            const value = variable.value as FixCoBorrowerCondition;
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
            const value = variable.value as FPEstimateRateData;
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

export type IFixPurchase = Instance<typeof FixPurchase>;
export type SFixPurchase = SnapshotIn<typeof FixPurchase>;
