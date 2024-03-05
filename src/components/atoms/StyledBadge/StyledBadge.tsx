import { FC } from 'react';
import { Box } from '@mui/material';

import { StyledBadgeProps } from './index';
import { POSFlex, POSFont } from '@/styles';
import { AppraisalStage, LoanStage } from '@/types';

export const StyledBadge: FC<StyledBadgeProps> = ({ content, status }) => {
  const computedStyles = () => ({
    ...POSFlex('center', 'center', 'row'),
    ...POSFont(12, 600, 1.5, undefined),
    width: 120,
    height: 24,
    borderRadius: 1,
    background: () => {
      switch (status) {
        case LoanStage.Application:
          return 'rgba(144, 149, 163, 0.2);';
        case LoanStage.FinalClosing:
          return 'rgba(68, 235, 10, 0.2)';
        case LoanStage.Approved:
          return 'rgba(43, 193, 85, 0.1)';
        case LoanStage.PreApproved:
          return 'rgba(21, 110, 250, 0.2)';
        case LoanStage.RateLocked:
          return 'rgba(63, 81, 181, 0.2)';
        case LoanStage.RateLocking:
          return 'rgba(63, 81, 181, 0.2)';
        case LoanStage.Refusal:
          return 'rgba(255, 109, 77, 0.1)';
        case LoanStage.DocsOut:
          return 'rgba(68, 10, 235, 0.15)';
        case LoanStage.Funded:
          return 'rgba(68, 235, 10, 0.20)';
      }
    },
    color: () => {
      switch (status) {
        case LoanStage.Application:
          return '#202939';
        case LoanStage.FinalClosing:
          return '#00A223';
        case LoanStage.Approved:
          return '#4FBF67';
        case LoanStage.PreApproved:
          return '#3F81E9';
        case LoanStage.RateLocked:
          return '#3F51B5';
        case LoanStage.RateLocking:
          return '#3F51B5';
        case LoanStage.Refusal:
          return '#FF6D4D';
        case LoanStage.DocsOut:
          return '#5A00A1';
        case LoanStage.Funded:
          return '#00A123';
      }
    },
  });

  return <Box sx={computedStyles()}>{content}</Box>;
};
