import { useBreakpoints } from '@/hooks';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { StyledFormItemProps } from './index';

export const StyledFormItem: FC<StyledFormItemProps> = ({
  children,
  label,
  labelSx,
  ...rest
}) => {
  const breakpoints = useBreakpoints();
  return (
    <Box {...rest}>
      <Typography
        component={'div'}
        mb={3}
        sx={labelSx}
        variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h4' : 'h3'}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
};
