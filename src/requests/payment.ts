import { post } from './axios';

export interface ICreateSpecifyPaymentParams {
  id: number | undefined;
  receiptEmail: string | undefined;
}

export interface ICreatePaymentRes {
  loanApprovalId: number;
  clientSecret: string;
  paymentAmount: number;
  loanRate: ILoanRate;
  created: number;
  borrowerName: string;
  propertyAddress: string;
  productName: string;
  appraisalFees: number;
  expeditedFees: number;
  isExpedited: boolean;
}

export interface ILoanRate {
  isFinished: boolean;
  loanPurpose: string;
  arv: number;
  cashOutAmount: number;
  estimatedPropertyValue: number;
  interestRate: number;
  purchaseLoanAmount: number;
  loanTerm: number;
  loanValue: number;
  loanCost: number;
  purchasePrice: number;
  rehabAmount: number;
  remainingLoanBalance: number;
  totalLoanAmount: number;
  interestReserveAmount: number;
}

export const _creatSpecifyPayment = (param: ICreateSpecifyPaymentParams) => {
  return post<ICreatePaymentRes>('/los/loan/approval/createPayment', param);
};
