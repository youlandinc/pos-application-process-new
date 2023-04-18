import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';

export interface StyledDatePickerProps {
  label?: string;
  value: unknown;
  onChange: (
    value: unknown,
    context: PickerChangeHandlerContext<unknown>,
  ) => void;
}
