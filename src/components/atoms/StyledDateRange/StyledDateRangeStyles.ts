import { SxProps } from '@mui/material';
import { POSFont } from '@/styles';

export const StyledDateRangeStyles: SxProps = {
  '& .react-datepicker__portal': {
    bgcolor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .react-datepicker__close-icon': {
    right: 42,
    '&::after': {
      color: 'text.primary',
      bgcolor: 'transparent',
      content: '""',
    },
  },
  '& .react-datepicker-popper': {
    zIndex: 2,
  },
  '& .MuiInputBase-input': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .react-datepicker': {
    border: 'none',
    bgcolor: 'background.white',
    boxShadow:
      '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
    borderRadius: 1,
    '& .react-datepicker__day-name': {
      width: 36,
      fontSize: 0,
      color: 'text.secondary',
      '&:first-letter': {
        fontSize: 14,
      },
    },
    '& .react-datepicker__day--today': {
      borderRadius: '50% !important',
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'text.secondary',
    },
    '& .react-datepicker__day': {
      width: 36,
      height: 36,
      lineHeight: '36px',
      fontSize: 14,
      borderRadius: '50%',
      color: 'text.primary',
      '&:hover': {
        borderRadius: '50% !important',
        bgcolor: 'primary.A200',
      },
    },
    '& .react-datepicker__triangle::after, .react-datepicker__triangle::before':
      {
        display: 'none',
      },
    '& .react-datepicker__day--in-range': {
      borderRadius: '50%',
      bgcolor: 'primary.main',
      color: 'text.white',
    },
    '& .react-datepicker__day--in-selecting-range': {
      bgcolor: 'primary.A200',
      borderRadius: '50% !important',
    },
    '& .react-datepicker__header': {
      bgcolor: 'background.white',
      border: 'none',
      '& .MuiIconButton-root': {
        px: 0,
      },
    },
    '& .years-box': {
      maxHeight: 300,
      width: 300,
      overflow: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      px: 0,
      '& li': {
        py: 0.5,
        px: 2,
        my: 1,
        mx: 0.5,
        cursor: 'pointer',
        borderRadius: 8,
        ...POSFont(14, 400, 1.5, 'text.primary'),
        '&:hover': {
          bgcolor: 'primary.A200',
        },
        '&.isSelected': {
          bgcolor: 'primary.main',
          color: 'text.white',
        },
      },
    },
  },
} as const;
