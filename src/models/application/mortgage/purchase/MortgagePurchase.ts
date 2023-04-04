import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { CreditScore, IApplicationForm } from '@/models/application';
import {
  MortgagePurchaseAssets,
  MortgagePurchaseDTI,
  MortgagePurchaseRealtor,
  MortgagePurchaseStarting,
} from './index';
import { Options } from '@/types/options';
import { VariableValue } from '@/types/common';
import {
  BorrowerData,
  BorrowerDebtRecordData,
  BorrowerDebtSummaryData,
  MortgageAboutOtherRelationData,
  MortgageApplicationProcessSnapshot,
  MortgageFinancialSituationData,
  MortgagePropertyNewData,
  MortgagePropertyOwnData,
  MortgageStartingData,
  OtherIncomeData,
  SalaryIncomeData,
  SelfEmployIncomeData,
  SelfInfoData,
} from '@/types/application';
import { AssetsState, MortgagePurchaseState, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';

export const MortgagePurchase = types
  .model({
    name: 'MortgagePurchase',
    starting: MortgagePurchaseStarting,
    creditScore: CreditScore,
    assets: MortgagePurchaseAssets,
    realtor: MortgagePurchaseRealtor,
    DTI: MortgagePurchaseDTI,
    preApproved: types.boolean,
    denialReason: types.maybe(types.frozen<Options.DenialReason>()),
    state: types.frozen<MortgagePurchaseState>(),
  })
  .actions((self) => ({
    changeState(state: MortgagePurchaseState) {
      self.state = state;
    },
    setPreApproved(preApproved: boolean, denialReason: Options.DenialReason) {
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
      self.state = state as MortgagePurchaseState;
      self.starting.state = starting.state;
      self.creditScore.state = creditScore.state;
      self.assets.state = assets.state as AssetsState;
      self.DTI.state = DTI.state;
    },
    injectClientData(variables: Variable<VariableValue>[]) {
      variables.forEach((variable) => {
        switch (variable.name as VariableName) {
          case VariableName.starting: {
            const value = variable.value as MortgageStartingData;
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
          case VariableName.financialSituation: {
            const value = variable.value as MortgageFinancialSituationData;
            self.assets.financialSituation.injectServerData(value);
            break;
          }
          case VariableName.currentEstate:
          case VariableName.propertyOwn: {
            const value = variable.value as MortgagePropertyOwnData;
            self.assets.injectPropertyData(value);
            break;
          }
          case VariableName._borrowerDebtSummary: {
            let temp;
            const value = variable.value as BorrowerDebtSummaryData;
            const result = variables.find(
              (item) => item.name === VariableName.merge_borrowerDebt,
            );
            if (
              result &&
              Object.keys((result.value as BorrowerDebtRecordData).payments)
                .length > 0
            ) {
              temp = result.value;
            }
            self.creditScore.setDebts(temp || value, 'self');
            break;
          }
          case VariableName._otherDebtSummary: {
            let temp;
            const value = variable.value as BorrowerDebtSummaryData;
            const result = variables.find(
              (item) => item.name === VariableName.merge_otherDebt,
            );
            if (
              result &&
              Object.keys((result.value as BorrowerDebtRecordData).payments)
                .length > 0
            ) {
              temp = result.value;
            }
            self.creditScore.setDebts(temp || value, 'coBorrower');
            break;
          }
          case VariableName.propertyNew: {
            const value = variable.value as MortgagePropertyNewData;
            const { downPayment, purchasePrice } = value;
            self.assets.downPayment = downPayment;
            self.assets.purchasePrice = purchasePrice;
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

export type IMortgagePurchase = Instance<typeof MortgagePurchase>;
export type SMortgagePurchase = SnapshotIn<typeof MortgagePurchase>;
