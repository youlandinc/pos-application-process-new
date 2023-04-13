import { FC, useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import {
  NumberFormatValues,
  NumericFormat,
  numericFormatter,
} from 'react-number-format';

import {
  StyledTextFieldNumberProps,
  StyledTextFieldStyles,
} from '@/components/atoms';

export const StyledTextFieldNumber: FC<StyledTextFieldNumberProps> = ({
  allowNegative = false,
  onValueChange,
  prefix,
  suffix,
  value,
  sx,
  decimalScale = 2,
  thousandSeparator = true,
  ...rest
}) => {
  const [isFocus, setIsFocus] = useState(value !== void 0 || !!prefix);

  const [text, setText] = useState<number | string>(value);

  useEffect(
    () => {
      if (value) {
        setText(
          numericFormatter(value.toString(), {
            fixedDecimalScale: true,
            decimalScale,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handledChange = (v: NumberFormatValues) => {
    setText(v.formattedValue);
    onValueChange(v);
  };

  return (
    <>
      <NumericFormat
        allowedDecimalSeparators={['.']}
        allowNegative={allowNegative}
        customInput={TextField}
        decimalScale={decimalScale}
        fixedDecimalScale
        InputLabelProps={{ shrink: isFocus }}
        InputProps={{
          value: text ? (thousandSeparator ? text.toLocaleString() : text) : '',
          startAdornment: !!prefix && (
            <InputAdornment position="start" sx={{ p: 0, m: 0 }}>
              {prefix}
            </InputAdornment>
          ),
          endAdornment: !!suffix && (
            <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
              {suffix}
            </InputAdornment>
          ),
        }}
        onBlur={(e) => {
          if (prefix) {
            return;
          }
          e.preventDefault();
          if (!text) {
            setIsFocus(false);
          }
        }}
        onFocus={(e) => {
          if (prefix) {
            return;
          }
          e.preventDefault();
          setIsFocus(true);
        }}
        onValueChange={handledChange}
        sx={Object.assign(
          {},
          {
            ...StyledTextFieldStyles,
            ...sx,
          },
        )}
        thousandSeparator={thousandSeparator}
        variant={'outlined'}
        {...rest}
      />
    </>
  );
};
