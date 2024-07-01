import { FC } from 'react';
import { Box } from '@mui/material';

import { StyledBadgeProps } from './index';
import { POSFlex, POSFont } from '@/styles';
import { PipelineLoanStageEnum } from '@/types';

export const StyledBadge: FC<StyledBadgeProps> = ({ content, status }) => {
  const computedStyles = () => ({
    ...POSFlex('center', 'center', 'row'),
    ...POSFont(12, 600, 1.5, undefined),
    width: 120,
    height: 24,
    borderRadius: 1,
    background: () => {
      switch (status) {
        case PipelineLoanStageEnum.not_submitted:
          return 'rgba(176, 176, 176, 0.2)';
        case PipelineLoanStageEnum.scenario:
          return 'rgba(176, 176, 176, 0.2)';
        case PipelineLoanStageEnum.inactive:
          return 'rgba(176, 176, 176, 0.2)';
        case PipelineLoanStageEnum.initial_approval:
        case PipelineLoanStageEnum.pre_approved:
          return '#DBF4EF';
        case PipelineLoanStageEnum.preparing_docs:
          return 'rgba(10, 154, 235, 0.2)';
        case PipelineLoanStageEnum.docs_out:
          return 'rgba(68, 10, 235, 0.15)';
        case PipelineLoanStageEnum.funded:
          return 'rgba(68, 235, 10, 0.2)';
        case PipelineLoanStageEnum.rejected:
          return 'rgba(235, 10, 10, 0.15)';
      }
    },
    color: () => {
      switch (status) {
        case PipelineLoanStageEnum.not_submitted:
          return '#4F4F4F';
        case PipelineLoanStageEnum.scenario:
          return '#4F4F4F';
        case PipelineLoanStageEnum.inactive:
          return 'rgba(79, 79, 79, 0.5)';
        case PipelineLoanStageEnum.initial_approval:
        case PipelineLoanStageEnum.pre_approved:
          return '#099D99';
        case PipelineLoanStageEnum.preparing_docs:
          return '#005EA1';
        case PipelineLoanStageEnum.docs_out:
          return '#5A00A1';
        case PipelineLoanStageEnum.funded:
          return '#00A123';
        case PipelineLoanStageEnum.rejected:
          return '#A10000';
      }
    },
  });

  return <Box sx={computedStyles()}>{content}</Box>;
};
