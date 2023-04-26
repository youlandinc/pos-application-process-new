import { LoanStage, LoanType, UserType } from '@/types';
import { ReactNode } from 'react';

export interface LoanItemCardProps {
  formData: {
    address: string;
    productType: LoanType;
    loanAmount: number;
    applicationTime: Date | string;
    loanStage: LoanStage;
    brokerOriginationFee?: number;
    brokerProcessingFee?: number;
    brokerPoints?: number;
    officerOriginationFee?: number;
    officerProcessingFee?: number;
    officerPoints?: number;
    youlandId: string;
    agentFee?: number;
  };
  userType: UserType | undefined;
  children?: ReactNode;
}
