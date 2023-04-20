export const StyledDialogStyles = {
  '&.MuiDialog-root': {
    '& .MuiDialog-paper': {
      width: {
        lg: 'calc(100% - 64px)',
        xs: 'calc(100% - 48px)',
      },
      mx: 3,
    },
    '& .MuiPaper-root': {
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
