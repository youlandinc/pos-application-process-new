import { ReactNode } from 'react';
import { DialogProps } from '@mui/material';

export interface StyledDialogProps extends DialogProps {
  Title?: string | ReactNode;
  handleClose: () => void;
}
