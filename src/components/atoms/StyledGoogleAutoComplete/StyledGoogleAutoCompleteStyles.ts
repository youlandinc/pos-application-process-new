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
      ...POSFlex('center', 'flex-start', { lg: 'row', xs: 'column' }),
      width: '100%',
      mt: 3,
      gap: 3,
      '& *': {
        flex: 1,
      },
    },
  },
  inside: {
    autoComplete: {
      width: '100%',
    },
    icon: {
      width: 'calc(100% - 44px)',
      wordWrap: 'break-word',
    },
  },
};
