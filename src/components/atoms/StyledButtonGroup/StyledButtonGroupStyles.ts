import { SxProps } from '@mui/material';

export const StyledButtonGroupStyles: SxProps = {
  '& .MuiToggleButton-root': {
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: 16,
    color: 'text.primary',
    height: '48px',
    borderRadius: 2,
    boxShadow: 'none',
    py: 2,
    px: 6,
    '&.Mui-selected': {
      bgcolor: 'primary.A200',
      borderColor: 'primary.main',
    },
    '&:disabled': {
      color: 'text.disabled',
      borderColor: 'text.secondary',
      '&.Mui-selected': {
        color: 'text.secondary',
        bgcolor: 'text.disabled',
      },
    },
    '&.MuiToggleButton--sizeSmall': {
      height: '36px',
      py: 1,
      fontSize: 14,
    },
  },
};
