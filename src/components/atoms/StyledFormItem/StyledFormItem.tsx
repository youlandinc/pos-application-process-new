import { useBreakpoints } from '@/hooks';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { StyledFormItemProps } from './index';

export const StyledFormItem: FC<StyledFormItemProps> = ({
  children,
  label,
  labelSx,
  tip,
  tipSx,
  sx,
  ...rest
}) => {
  const breakpoints = useBreakpoints();
  return (
    <Box sx={{ maxWidth: 900, width: '100%', ...sx }} {...rest}>
      <Typography
        component={'div'}
        mb={3}
        sx={labelSx}
        textAlign={'center'}
        variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h4' : 'h3'}
      >
        {label}
      </Typography>
      {tip && (
        <Typography
          component={'div'}
          mb={6}
          sx={{ color: 'info.A100', ...tipSx }}
          textAlign={'center'}
          variant={'body1'}
        >
          {tip}
        </Typography>
      )}
      {children}
    </Box>
  );
};
