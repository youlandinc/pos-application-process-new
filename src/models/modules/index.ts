// base common state for other
export * from './Address';
export * from './LoanData';
export * from './DebtData';
export * from './CreditScore';
export * from './FinancialSituation';

/**
 * @summary production lines state
 * @author Eric Lee
 * @description sort by application/mortgage/purchase or application/mortgage/refinance..., you need to check detail(about their own production lines state) in their corresponding folder
 * @short-name mortgage purchase === MP , mortgage refinance === MR
 */
export * from './application';
