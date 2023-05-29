export const StyledDialogStyles = {
  '&.MuiDialog-root': {
    '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root':
      {
        //p: 0,
      },
    '& .dialog_header': {
      px: 3,
      pt: 3,
      fontWeight: 600,
      fontSize: 18,
      color: 'text.primary',
    },
    '& .dialog_footer': {
      textAlign: 'right',
      px: 3,
      pb: 3,
    },
    '& .dialog_content': {
      px: 3,
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
  },
} as const;
