import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledCheckboxClasses: SxProps = {
  alignItems: 'flex-start',
  '& .MuiCheckbox-root': {
    mt: '-10px',
    mr: '-10px',
  },
  '& .MuiFormControlLabel-label': {
    width: 200,
    ml: 1.5,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    ...POSFont(14, 400, 1.5, 'text.primary'),
  },
};
