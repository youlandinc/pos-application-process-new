// import { utils } from '@/common/utils';
import { LoanStage, ServerTaskKey, VariableName } from '@/types/enum';
import { ProcessData } from '@/types/server';
import {
  AddressData,
  BorrowerDebtSummaryData,
  BridgeApplicationProcessSnapshot,
  BridgeStartingData,
  Encompass,
  EstateAgent,
  MortgageFinancialSituationData,
  MortgagePropertyNewData,
  MortgageStartingData,
  OtherIncomeData,
  SalaryIncomeData,
  SelfEmployIncomeData,
  SelfInfoData,
} from '@/types';

import { OccupancyOpt, PropertyOpt, PropertyUnitOpt } from '@/types/options';
import {
  POSFindSpecificVariable,
  POSFormatDate,
  POSFormatDollar,
} from '@/utils';

interface VariableMap {
  _startingData?: MortgageStartingData & BridgeStartingData;
  _propertyNewData?: MortgagePropertyNewData;
  _clientAppProgressData?: BridgeApplicationProcessSnapshot;
  _selfInfoData?: SelfInfoData;
  _borrowerOtherIncome?: OtherIncomeData;
  _borrowerSelfEmployIncome?: SelfEmployIncomeData;
  _borrowerSalaryIncome?: SalaryIncomeData;
  _borrowerDebtData?: BorrowerDebtSummaryData;
  _borrowerFinancialData?: MortgageFinancialSituationData;
  _estateAgent?: EstateAgent;
  _encompass?: Encompass;
}

type PrivateFieldName = keyof VariableMap;

export class ParseProcess {
  readonly processData: ProcessData;
  private _variableMap: VariableMap = {
    _startingData: void 0,
    _propertyNewData: void 0,
    _clientAppProgressData: void 0,
    _selfInfoData: void 0,
    _borrowerOtherIncome: void 0,
    _borrowerSelfEmployIncome: void 0,
    _borrowerSalaryIncome: void 0,
    _borrowerDebtData: void 0,
    _borrowerFinancialData: void 0,
    _estateAgent: void 0,
    _encompass: void 0,
  };

  constructor(processData: ProcessData) {
    this.processData = processData;
  }

  private findAndAssignVariants<
    K extends PrivateFieldName,
    T extends VariableMap[K],
  >(key: K, variableName: VariableName): void {
    if (this._variableMap[key]) {
      return;
    }
    const findR = POSFindSpecificVariable(
      variableName,
      this.processData.extra.variables,
    );
    if (findR) {
      this._variableMap[key] = <T>findR.value;
    }
  }

  get id(): string {
    return this.processData.extra.id;
  }

  get paymentTaskId(): string {
    const temp = this.processData.currentTasks.find(
      (item) => item.bpmn.key === ServerTaskKey.pay_fee_loan_locking,
    );
    if (temp) {
      return temp.extra.id;
    }
    return '';
  }

  get startingData(): Maybe<MortgageStartingData & BridgeStartingData> {
    this.findAndAssignVariants('_startingData', VariableName.starting);
    if (this._variableMap._startingData) {
      return this._variableMap._startingData;
    }
  }

  get propertyAddress(): Maybe<AddressData> {
    this.findAndAssignVariants('_startingData', VariableName.starting);
    if (this._variableMap._startingData) {
      return this._variableMap._startingData.propAddr;
    }
  }

  get occupancyOpt(): OccupancyOpt {
    this.findAndAssignVariants('_startingData', VariableName.starting);
    if (this._variableMap._startingData) {
      return this._variableMap._startingData.occupancyOpt;
    }
    return OccupancyOpt.default;
  }

  get propertyOpt(): PropertyOpt {
    this.findAndAssignVariants('_startingData', VariableName.starting);
    if (this._variableMap._startingData) {
      return (
        this._variableMap._startingData.propertyOpt ||
        this._variableMap._startingData.propertyType
      );
    }
    return PropertyOpt.default;
  }

  get numberOfUnits(): PropertyUnitOpt {
    this.findAndAssignVariants('_startingData', VariableName.starting);
    if (this._variableMap._startingData) {
      return this._variableMap._startingData.numberOfUnits;
    }
    return PropertyUnitOpt.default;
  }

  get selfInfoData(): Maybe<SelfInfoData> {
    this.findAndAssignVariants('_selfInfoData', VariableName.aboutUSelf);
    if (this._variableMap._selfInfoData) {
      return this._variableMap._selfInfoData;
    }
  }

  get productCategory(): Maybe<ProductCategory> {
    this.findAndAssignVariants(
      '_clientAppProgressData',
      VariableName.clientAppProgress,
    );
    if (this._variableMap._clientAppProgressData) {
      return this._variableMap._clientAppProgressData.productCategory;
    }
  }

  get propertyNewData(): MortgagePropertyNewData {
    this.findAndAssignVariants('_propertyNewData', VariableName.propertyNew);
    if (this._variableMap._propertyNewData) {
      return this._variableMap._propertyNewData;
    }
    return {
      purchasePrice: 0,
      downPayment: 0,
    };
  }

  get clientAppProgressData(): Maybe<BridgeApplicationProcessSnapshot> {
    this.findAndAssignVariants(
      '_clientAppProgressData',
      VariableName.clientAppProgress,
    );
    if (this._variableMap._clientAppProgressData) {
      return this._variableMap._clientAppProgressData;
    }
  }

  get borrowerSalaryIncome(): Maybe<SalaryIncomeData> {
    this.findAndAssignVariants(
      '_borrowerSalaryIncome',
      VariableName.salaryIncome,
    );
    if (this._variableMap._borrowerSalaryIncome) {
      return this._variableMap._borrowerSalaryIncome;
    }
  }

  get borrowerSelfEmployIncome(): Maybe<SelfEmployIncomeData> {
    this.findAndAssignVariants(
      '_borrowerSelfEmployIncome',
      VariableName.selfEmployIncome,
    );
    if (this._variableMap._borrowerSelfEmployIncome) {
      return this._variableMap._borrowerSelfEmployIncome;
    }
  }

  get borrowerOtherIncome(): Maybe<OtherIncomeData> {
    this.findAndAssignVariants(
      '_borrowerOtherIncome',
      VariableName.otherIncome,
    );
    if (this._variableMap._borrowerOtherIncome) {
      return this._variableMap._borrowerOtherIncome;
    }
  }

  get borrowerDebtData(): Maybe<BorrowerDebtSummaryData> {
    this.findAndAssignVariants(
      '_borrowerDebtData',
      VariableName._borrowerDebtSummary,
    );
    if (this._variableMap._borrowerDebtData) {
      return this._variableMap._borrowerDebtData;
    }
  }

  get borrowerFinancialData(): Maybe<MortgageFinancialSituationData> {
    this.findAndAssignVariants(
      '_borrowerFinancialData',
      VariableName.financialSituation,
    );
    if (this._variableMap._borrowerFinancialData) {
      return this._variableMap._borrowerFinancialData;
    }
  }

  get estateAgentData(): Maybe<EstateAgent> {
    this.findAndAssignVariants('_estateAgent', VariableName.estateAgent);
    if (this._variableMap._estateAgent) {
      return this._variableMap._estateAgent;
    }
  }

  get encompassData(): Maybe<Encompass> {
    this.findAndAssignVariants('_encompass', VariableName._encompass);
    if (this._variableMap._encompass) {
      return this._variableMap._encompass;
    }
  }

  public get getLoanAmount(): number {
    return this.propertyNewData
      ? this.propertyNewData.purchasePrice - this.propertyNewData.downPayment
      : 0;
  }

  public get getDownPaymentAmount(): number {
    return this.propertyNewData ? this.propertyNewData.downPayment : 0;
  }

  public get getPurchaseAmount(): number {
    return this.propertyNewData ? this.propertyNewData.purchasePrice : 0;
  }

  public get productType(): string {
    return this.clientAppProgressData
      ? `${this.clientAppProgressData.productCategory} ${this.clientAppProgressData.applicationType}`
      : 'Unknown';
  }

  public get loanStage(): LoanStage {
    return this.processData.stage;
  }
}

export interface IProcessGridData {
  youlandId: string;
  applicationTime: string;
  loanAmount: string; // This value is handled in utils.formatDollar
  productType: string;
  stage: LoanStage;
}

export class ParseProcessGridData extends ParseProcess {
  constructor(processData: ProcessData) {
    super(processData);
  }

  private getApplicationTime(): string {
    return POSFormatDate(
      new Date(this.processData.extra.startTime),
      'yyyy-MM-dd HH:mm:ss O',
    );
  }

  get processGridData(): IProcessGridData {
    return {
      youlandId: this.id,
      applicationTime: this.getApplicationTime(),
      loanAmount: POSFormatDollar(this.getLoanAmount),
      productType: this.productType,
      stage: this.loanStage,
    };
  }
}
