import { ReactNode } from 'react';
import { BoxProps, SxProps } from '@mui/material';

export interface PageHeaderProps extends Omit<BoxProps, 'title'> {
  children?: ReactNode;
  sx?: SxProps;
  title: ReactNode;
  titleSx?: SxProps;
  subTitle?: ReactNode;
  subTitleSx?: SxProps;
}
