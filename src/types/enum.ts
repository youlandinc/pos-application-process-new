export enum SceneType {
  default = '',
  unknown = 'Unknown',
  mortgage_purchase = 'mortgage purchase',
  mortgage_refinance = 'mortgage refinance',
  bridge_purchase = 'bridge purchase',
  bridge_refinance = 'bridge refinance',
  fix_purchase = 'fix_and_flip purchase',
  fix_refinance = 'fix_and_flip refinance',
  ground_purchase = 'ground_up_construction purchase',
  ground_refinance = 'ground_up_construction refinance',
}

export enum ServerTaskKey {
  // common task
  // starting,refuse,about_yourself,income,about_other,income_of_other...
  where_know_us = 'where_know_us',
  // mortgage purchase
  starting = 'starting',
  about_yourself = 'about_yourself',
  income = 'income',
  about_other = 'about_other',
  income_of_other = 'income_of_other',
  your_property = 'your_property',
  finance = 'finance',
  new_property = 'new_property',
  misc_b4_preapproval = 'misc_b4_preapproval',
  notice_recon = 'notice_recon',
  reconcile = 'reconcile',
  initiate_manual_review = 'initiate_manual_review',
  pay_fee_loan_locking = 'pay_fee_loan_locking',
  refuse = 'refuse',
  // mortgage refinance
  monthly_payment = 'monthly_payment',
  residence_own = 'residence_own',
  why_refinance = 'why_refinance',
  // bridge purchase / refinance
  estimate_rate = 'estimate_rate',
}

// client state

export enum StartingState {
  purpose = 'purpose',
  property = 'property',
}

export enum CreditScoreState {
  notice = 'notice',
  selfInfo = 'selfInfo',
  creditScore = 'creditScore',
  validateError = 'validateError',
  selfIncome = 'selfIncome',
  coBorrower = 'coBorrower',
  coBorrowerRelationship = 'coBorrowerRelationship',
  coBorrowerInfo = 'coBorrowerInfo',
  coBorrowerIncome = 'coBorrowerIncome',
}

export enum AssetsState {
  currentEstate = 'currentEstate',
  realEstate = 'realEstate',
  financialSituation = 'financialSituation',
  propertyPrice = 'propertyPrice',
  everOwnedEstate = 'everOwnedEstate',
}

export enum DTIState {
  notice = 'notice',
  selfDebtTable = 'selfDebtTable',
  selfPayoffDebt = 'selfPayoffDebt',
  selfIncome = 'selfIncome',
  coBorrowerDebtTable = 'coBorrowerDebtTable',
  coBorrowerPayoffDebt = 'coBorrowerPayoffDebt',
  coBorrowerIncome = 'coBorrowerIncome',
}

export enum MortgagePurchaseState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  DTI = 'DTI',
  assets = 'assets',
  realtor = 'realtor',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum VariableName {
  clientAppProgress = 'clientAppProgress',
  starting = 'starting',
  propertyNew = 'propertyNew',
  loanLockFee = 'loanLockFee',
  whereKnowUs = 'whereKnowUs',

  // current is before propertyOwn step
  currentEstate = 'currentEstate',
  propertyOwn = 'propertyOwn',
  estateAgent = 'estateAgent',
  aboutUSelf = 'aboutUSelf',
  salaryIncome = 'salaryIncome',
  selfEmployIncome = 'selfEmployIncome',
  otherIncome = 'otherIncome',
  aboutOtherRelation = 'aboutOtherRelation',
  aboutOtherInfo = 'aboutOtherInfo',
  financialSituation = 'financialSituation',
  salaryIncomeOfOther = 'salaryIncomeOfOther',
  selfEmployIncomeOfOther = 'selfEmployIncomeOfOther',
  otherIncomeOfOther = 'otherIncomeOfOther',
  _loanCalcSettings = '_loanCalcSettings',
  _borrower = '_borrower',
  _borrowerDebtSummary = '_borrowerDebtSummary',
  _borrowerIncomeSummary = '_borrowerIncomeSummary',
  _otherPerson = '_otherPerson',
  _otherDebtSummary = '_otherDebtSummary',
  _otherIncomeSummary = '_otherIncomeSummary',
  _encompass = '_encompass',

  // for record debts change
  merge_borrowerDebt = 'merge_borrowerDebt',
  merge_otherDebt = 'merge_otherDebt',
  merge_debtConsolidate = 'merge_debtConsolidate',

  // refinance
  monthlyPayment = 'monthlyPayment',
  residenceOwn = 'residenceOwn',
  yourProperty = 'yourProperty',
  whyRefinance = 'whyRefinance',

  // bridge
  estimateRate = 'estimateRate',
  aboutOtherCondition = 'aboutOtherCondition',
}

export enum LoanType {
  UNCATEGORIZED = 'UNCATEGORIZED',
  ADJUSTABLE_51 = 'ADJUSTABLE_51',
  ADJUSTABLE_71 = 'ADJUSTABLE_71',
  FIXED_YEAR_5 = 'FIXED_YEAR_5',
  FIXED_YEAR_10 = 'FIXED_YEAR_10',
  FIXED_YEAR_15 = 'FIXED_YEAR_15',
  FIXED_YEAR_20 = 'FIXED_YEAR_20',
  FIXED_YEAR_25 = 'FIXED_YEAR_25',
  FIXED_YEAR_30 = 'FIXED_YEAR_30',
}

export enum LoanStage {
  Application = 'Application',
  PreApproved = 'Pre-approved',
  RateLocking = 'Rate locking',
  RateLocked = 'Rate locked',
  Approved = 'Approved',
  FinalClosing = 'Final closing',
  Refusal = 'Rejected',
}

export enum LoanSpecies {
  Mortgage = 'Mortgage',
  Bridge = 'Bridge',
  FixAndFlip = 'FixAndFlip',
  GroundUpConstruction = 'GroundUpConstruction',
}

export enum LoanPurpose {
  Purchase = 'Purchase',
  Refinance = 'Refinance',
}

// mortgage refinance, short-name is mr
export enum MortgageRefinanceState {
  starting = 'starting',
  auth = 'auth',
  creditScore = 'creditScore',
  monthlyPayment = 'monthlyPayment',
  assets = 'assets',
  DTI = 'DTI',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum MortgageRefinanceAssetsState {
  residence_own = 'residence_own',
  your_property = 'your_property',
  why_refinance = 'why_refinance',
  finance = 'finance',
}

export enum LoanScene {
  MP = 'mortgage purchase',
  MR = 'mortgage refinance',
  BP = 'bridge purchase',
  BR = 'bridge refinance',
}

// bridge
export enum BridgePurchaseState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum BridgeRefinanceState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

// fix and flip
export enum FixAndFlipPurchaseState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum FixAndFlipRefinanceState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

// ground up
export enum GroundUpConstructionPurchaseState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum GroundUpConstructionRefinanceState {
  starting = 'starting',
  creditScore = 'creditScore',
  auth = 'auth',
  whereKnowUs = 'whereKnowUs',
  estimateRate = 'estimateRate',
  celebrate = 'celebrate',
  refuse = 'refuse',
}

export enum BridgeCreditScoreState {
  notice = 'notice',
  selfInfo = 'selfInfo',
  creditScore = 'creditScore',
  coBorrowerInfo = 'coBorrowerInfo',
}

export enum FixAndFlipCreditScoreState {
  notice = 'notice',
  selfInfo = 'selfInfo',
  creditScore = 'creditScore',
  coBorrowerInfo = 'coBorrowerInfo',
}

export enum GroundUpConstructionCreditScoreState {
  notice = 'notice',
  selfInfo = 'selfInfo',
  creditScore = 'creditScore',
  coBorrowerInfo = 'coBorrowerInfo',
}

export enum BizType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASS = 'RESET_PASS',
  CHANGE_PASS = 'CHANGE_PASS',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
}

export enum LoginType {
  YLACCOUNT_LOGIN = 'YLACCOUNT_LOGIN',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  DEFAULT = '',
}

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  BROKER = 'BROKER',
  REAL_ESTATE_AGENT = 'REAL_ESTATE_AGENT',
  LOAN_OFFICER = 'LOAN_OFFICER',
  LENDER = 'LENDER',
}

export enum ServiceTypeEnum {
  WHITE_LABEL = 'WHITE_LABEL',
  SAAS = 'SAAS',
}

export enum SoftCreditRequirementEnum {
  required = 'REQUIRED',
  optional = 'OPTIONAL',
}

export enum FreeTrialState {
  None = 'None',
  Activated = 'Activated',
  Expired = 'Expired',
}

export enum DomainState {
  CONNECTED = 'CONNECTED',
  WAITING_VERIFICATION = 'WAITING_VERIFICATION',
  NOT_LINKED = 'NOT_LINKED',
}

export enum DomainSource {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export enum FeeUnitEnum {
  dollar = 'DOLLAR',
  percent = 'PERCENT',
}
