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
      <Typography
        component={'div'}
        pb={{ xs: 1.5, lg: 3 }}
        sx={labelSx}
        textAlign={'left'}
        variant={
          sub
            ? ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'subtitle1'
              : 'h6'
            : ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'h6'
              : 'h5'
        }
        width={'100%'}
      >
        {label}
        {tip && (
          <Typography
            component={'div'}
            fontSize={{
              xs: 12,
              lg: 16,
            }}
            sx={{ color: 'info.main', ...tipSx }}
            textAlign={'center'}
            variant={'body1'}
          >
            {tip}
          </Typography>
        )}
      </Typography>

      <Stack gap={rest?.gap} mt={rest?.gap ? -rest?.gap : 0} width={'100%'}>
        {children}
      </Stack>
    </Stack>
  );
};
