import { useBreakpoints } from '@/hooks';
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { PageHeaderProps } from './index';

export const PageHeader: FC<PageHeaderProps> = ({
  children,
  title,
  titleSx,
  subTitle,
  subTitleSx,
  sx,
  ...rest
}) => {
  const breakpoints = useBreakpoints();
  return (
    <Box sx={{ maxWidth: 900, ...sx }} {...rest}>
      <Typography
        component={'div'}
        mb={3}
        sx={titleSx}
        textAlign={'center'}
        variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h4' : 'h3'}
      >
        {title}
      </Typography>
      {subTitle && (
        <Typography
          component={'div'}
          mb={6}
          sx={{ color: 'info.A100', ...subTitleSx }}
          textAlign={'center'}
          variant={'body1'}
        >
          {subTitle}
        </Typography>
      )}
      {children}
    </Box>
  );
};
