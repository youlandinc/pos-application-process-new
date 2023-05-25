import { FC } from 'react';
import { Box, SxProps } from '@mui/material';

import { POSFont } from '@/styles';
import { PipelineTaskItemStatus } from '@/types';

import { StyledStatusProps } from './index';

export const StyledStatus: FC<StyledStatusProps> = ({ status }) => {
  const computedStyles = (): SxProps => ({
    ...POSFont(12, 600, 1, 'rgba(0,0,0,.87)'),
    textAlign: 'center',
    width: 120,
    borderRadius: 1,
    py: 0.75,
    flexShrink: 0,
    background: () => {
      switch (status) {
        case PipelineTaskItemStatus.CONFIRMED:
          return '#4FBF67';
        case PipelineTaskItemStatus.FINISHED:
          return 'rgba(68, 235, 10, 0.2)';
        case PipelineTaskItemStatus.UNFINISHED:
          return 'rgba(144, 149, 163, 0.2)';
        default:
          return 'transparent';
      }
    },
    color: () => {
      switch (status) {
        case PipelineTaskItemStatus.CONFIRMED:
          return '#4FBF67';
        case PipelineTaskItemStatus.FINISHED:
          return '#00A223';
        case PipelineTaskItemStatus.UNFINISHED:
          return 'text.primary';
        default:
          return 'text.primary';
      }
    },
  });

  return (
    <Box sx={computedStyles()}>
      {(status as string).replace(/^./, (match) => match.toUpperCase())}
    </Box>
  );
};
