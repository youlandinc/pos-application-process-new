import { ButtonProps } from '@mui/material';

export interface StyledButtonPropsWithDisabled extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  isIconButton?: boolean;
  disabled?: boolean;
  component?: string;
  ref?: any;
}

export type StyledButtonProps<
  T extends StyledButtonPropsWithDisabled = StyledButtonPropsWithDisabled,
> = T &
  (T['loading'] extends undefined
    ? { disabled?: boolean }
    : { disabled?: boolean });
