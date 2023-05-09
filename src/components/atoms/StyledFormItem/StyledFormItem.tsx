import { useBreakpoints } from '@/hooks';
import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { StyledFormItemProps } from './index';

export const StyledFormItem: FC<StyledFormItemProps> = ({
  sub,
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
    <Stack maxWidth={900} sx={{ ...sx }} width={'100%'} {...rest}>
      <Typography
        component={'div'}
        mb={tip ? 1.5 : 3}
        sx={labelSx}
        textAlign={'center'}
        variant={
          ['xs', 'sm', 'md'].includes(breakpoints)
            ? sub
              ? 'h5'
              : 'h4'
            : sub
            ? 'h4'
            : 'h3'
        }
      >
        {label}
      </Typography>
      {tip && (
        <Typography
          component={'div'}
          mb={3}
          sx={{ color: 'info.A100', ...tipSx }}
          textAlign={'center'}
          variant={'body1'}
        >
          {tip}
        </Typography>
      )}
      {children}
    </Stack>
  );
};
