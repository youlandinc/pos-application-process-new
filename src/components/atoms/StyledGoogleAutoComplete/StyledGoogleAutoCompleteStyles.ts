import { POSFlex } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledGoogleAutoCompleteStyles: Record<
  string,
  Record<string, SxProps>
> = {
  outside: {
    autoCompleteWrap: {
      width: '100%',
    },
    inputWrap: {
      ...POSFlex('center', 'flex-start'),
      width: '100%',
      mt: 2.5,
      gap: 2.5,
      '& *': {
        flex: 1,
      },
    },
  },
  inside: {
    autoComplete: {
      width: '100%',
      '& .MuiOutlinedInput-root': {
        p: '6px',
      },
    },
    icon: {
      width: 'calc(100% - 44px)',
      wordWrap: 'break-word',
    },
  },
};
