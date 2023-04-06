import { ButtonProps, SxProps } from '@mui/material';

export interface StyledButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  sx: SxProps;
}
