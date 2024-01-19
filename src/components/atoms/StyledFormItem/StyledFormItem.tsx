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
    <Stack
      alignItems={'center'}
      maxWidth={900}
      sx={{ ...sx }}
      width={'100%'}
      {...rest}
    >
      <Stack maxWidth={900} width={'100%'}>
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
                ? 'h5'
                : 'h4'
          }
        >
          {label}
        </Typography>
        {tip && (
          <Typography
            component={'div'}
            mb={3}
            sx={{ color: 'info.main', ...tipSx }}
            textAlign={'center'}
            variant={'body1'}
          >
            {tip}
          </Typography>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
