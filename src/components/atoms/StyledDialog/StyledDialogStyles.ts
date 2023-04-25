import { SxProps } from '@mui/material';

export const StyledDialogStyles: SxProps = {
  '&.MuiDialog-root': {
    '& .dialog_header': {
      // minHeight: 76,
      px: 3,
      pt: 3,
      fontWeight: 600,
      fontSize: 18,
      color: 'text.primary',
    },
    '& .dialog_footer': {
      // minHeight: 60,
      textAlign: 'right',
      px: 3,
      pb: 3,
    },
    '& .dialog_content': {
      px: 3,
      // py: 1.5,
    },
    '& .MuiDialog-paper': {
      width: {
        lg: 'calc(100% - 64px)',
        xs: 'calc(100% - 48px)',
      },
      mx: 3,
    },
    '& .MuiPaper-root': {
      borderRadius: 2,
      maxWidth: {
        lg: 600,
        xs: '100%',
      },
      boxShadow:
        '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
    },

    '& .MuiDialogActions-root': {
      py: 1.5,
      px: 3,
    },
  },
} as const;
