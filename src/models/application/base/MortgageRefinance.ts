import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { IApplicationForm } from '@/models/base/ApplicationForm';
import { CreditScore } from '@/models/application/common/CreditScore';
import {
  MortgagePurchaseDTI,
  MortgageRefinanceAssets,
  MortgageRefinanceMonthlyPayment,
  MortgageRefinanceStarting,
} from '@/models/application/mortgage';

import { DenialReason } from '@/types/options';
import {
  MortgageRefinanceAssetsState,
  MortgageRefinanceState,
  VariableName,
} from '@/types/enum';
import { VariableValue } from '@/types/common';
import {
  BorrowerData,
  BorrowerDebtSummaryData,
  MortgageAboutOtherRelationData,
  MortgageApplicationProcessSnapshot,
  MortgageFinancialSituationData,
  MRMonthlyPaymentData,
  MRResidenceOwnData,
  MRStartingData,
  MRWhyRefinanceData,
  MRYourPropertyData,
  OtherIncomeData,
  SalaryIncomeData,
  SelfEmployIncomeData,
  SelfInfoData,
} from '@/types/application';
import { ProcessData } from '@/types/server';

export const MortgageRefinance = types
  .model({
    name: 'MortgageRefinance',
    starting: MortgageRefinanceStarting,
    creditScore: CreditScore,
    monthlyPayment: MortgageRefinanceMonthlyPayment,
    assets: MortgageRefinanceAssets,
    DTI: MortgagePurchaseDTI,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<DenialReason>()),
    state: types.frozen<MortgageRefinanceState>(),
  })
  .actions((self) => ({
    changeState(state: MortgageRefinanceState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: DenialReason) {
      self.preApproved = preApproved;
      self.denialReason = denialReason;
    },
    getApplicationProgressSnapshot(): MortgageApplicationProcessSnapshot {
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
        assets: {
          state: self.assets.state,
        },
        DTI: {
          state: self.DTI.state,
        },
        state,
      };
    },
    setClientState(clientAppProgress: MortgageApplicationProcessSnapshot) {
      const { state, creditScore, starting, assets, DTI } = clientAppProgress;
      self.state = state as MortgageRefinanceState;
      self.starting.state = starting.state;
      self.creditScore.state = creditScore.state;
      self.assets.state = assets.state as MortgageRefinanceAssetsState;
      self.DTI.state = DTI.state;
    },
    injectClientData(variables: Variable<VariableValue>[]) {
      variables.forEach((variable) => {
        switch (variable.name as VariableName) {
          case VariableName.starting: {
            const value = variable.value as MRStartingData;
            self.starting.injectServerData(value);
            break;
          }
          case VariableName.aboutUSelf: {
            const value = variable.value as SelfInfoData;
            self.creditScore.values.selfInfo.injectServerData(value);
            break;
          }
          case VariableName.aboutOtherInfo: {
            const value = variable.value as SelfInfoData;
            self.creditScore.values.coBorrowerInfo.injectServerData(value);
            break;
          }
          case VariableName._otherPerson: {
            const value = variable.value as BorrowerData;
            self.creditScore.values.coBorrowerInfo.creditScore =
              value.creditScore;
            break;
          }
          case VariableName._borrower: {
            const value = variable.value as BorrowerData;
            const {
              creditScore,
              reconciled = true,
              preApproved = false,
              denialReason,
            } = value;
            self.creditScore.values.selfInfo.creditScore = creditScore;
            self.DTI.reconciled = reconciled;
            self.preApproved = preApproved;
            self.denialReason = denialReason;
            break;
          }
          case VariableName.salaryIncome: {
            const value = variable.value as SalaryIncomeData;
            self.creditScore.values.selfIncome.injectServerData(
              VariableName.salaryIncome,
              value,
            );
            break;
          }
          case VariableName.salaryIncomeOfOther: {
            const value = variable.value as SalaryIncomeData;
            self.creditScore.values.coBorrowerIncome.injectServerData(
              VariableName.salaryIncomeOfOther,
              value,
            );
            break;
          }
          case VariableName.selfEmployIncome: {
            const value = variable.value as SelfEmployIncomeData;
            self.creditScore.values.selfIncome.injectServerData(
              VariableName.selfEmployIncome,
              value,
            );
            break;
          }
          case VariableName.selfEmployIncomeOfOther: {
            const value = variable.value as SelfEmployIncomeData;
            self.creditScore.values.coBorrowerIncome.injectServerData(
              VariableName.selfEmployIncomeOfOther,
              value,
            );
            break;
          }
          case VariableName.otherIncome: {
            const value = variable.value as OtherIncomeData;
            self.creditScore.values.selfIncome.injectServerData(
              VariableName.otherIncome,
              value,
            );
            break;
          }
          case VariableName.otherIncomeOfOther: {
            const value = variable.value as OtherIncomeData;
            self.creditScore.values.coBorrowerIncome.injectServerData(
              VariableName.otherIncomeOfOther,
              value,
            );
            break;
          }
          case VariableName.aboutOtherRelation: {
            const value = variable.value as MortgageAboutOtherRelationData;
            self.creditScore.injectCoBorrowerRelationshipData(value);
            break;
          }
          case VariableName.monthlyPayment: {
            const value = variable.value as MRMonthlyPaymentData;
            self.monthlyPayment.injectServerData(value);
            break;
          }
          case VariableName.residenceOwn: {
            const value = variable.value as MRResidenceOwnData;
            self.assets.values.residenceOwn.injectServerData(value);
            break;
          }
          case VariableName.yourProperty: {
            const value = variable.value as MRYourPropertyData;
            self.assets.injectServerData(value);
            break;
          }
          case VariableName.whyRefinance: {
            const value = variable.value as MRWhyRefinanceData;
            self.assets.values.whyRefinance.injectServerData(value);
            break;
          }
          case VariableName.financialSituation: {
            const value = variable.value as MortgageFinancialSituationData;
            self.assets.values.financialSituation.injectServerData(value);
            break;
          }
          case VariableName._borrowerDebtSummary: {
            const value = variable.value as BorrowerDebtSummaryData;
            self.creditScore.setDebts(value, 'self');
            break;
          }
          case VariableName._otherDebtSummary: {
            const value = variable.value as BorrowerDebtSummaryData;
            self.creditScore.setDebts(value, 'coBorrower');
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

export type IMortgageRefinance = Instance<typeof MortgageRefinance>;
export type SMortgageRefinance = SnapshotIn<typeof MortgageRefinance>;
