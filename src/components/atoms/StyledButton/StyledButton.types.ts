import { ButtonProps, IconButtonProps } from '@mui/material';

export interface StyledButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  isIconButton?: boolean;
}
