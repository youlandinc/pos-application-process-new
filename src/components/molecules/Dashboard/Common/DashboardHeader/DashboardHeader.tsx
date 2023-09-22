import { FC, ReactNode } from 'react';
import { Box, BoxProps, SxProps, Typography } from '@mui/material';

import { useBreakpoints } from '@/hooks';

export interface DashboardHeaderProps extends Omit<BoxProps, 'title'> {
  children?: ReactNode;
  sx?: SxProps;
  title: ReactNode;
  titleSx?: SxProps;
  subTitle?: ReactNode;
  subTitleSx?: SxProps;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
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
          sx={{ color: 'info.dark', ...subTitleSx }}
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
