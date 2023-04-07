import { FC } from 'react';
import { TextField } from '@mui/material';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import {
  StyledTextFieldClasses,
  StyledTextFieldNumberProps,
} from '@/components/atoms';

export const StyledTextFieldNumber: FC<StyledTextFieldNumberProps> = ({
  sx,
  prefix,
}) => {
  return (
    <>
      <NumericFormat
        customInput={TextField}
        sx={Object.assign(
          {},
          {
            ...StyledTextFieldClasses,
            ...sx,
            '& .MuiOutlinedInput-input': {
              padding: prefix
                ? '15.5px 32px 15.5px 4px'
                : '15.5px 32px 15.5px 14px',
            },
          },
        )}
      ></NumericFormat>
    </>
  );
};
