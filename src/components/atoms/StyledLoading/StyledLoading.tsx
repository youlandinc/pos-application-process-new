import { FC } from 'react';
import { CircularProgress } from '@mui/material';

import { StyledLoadingProps, StyledLoadingStyles } from './index';

export const StyledLoading: FC<StyledLoadingProps> = ({ sx }) => {
  return (
    <>
      <CircularProgress sx={{ ...StyledLoadingStyles, ...sx }} />
    </>
  );
};
