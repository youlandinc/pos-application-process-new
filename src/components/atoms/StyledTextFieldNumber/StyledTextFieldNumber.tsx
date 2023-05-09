import { FC, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
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
        InputProps={{
          value: text ? (thousandSeparator ? text.toLocaleString() : text) : '',
        }}
        onValueChange={handledChange}
        prefix={prefix}
        suffix={suffix}
        sx={{
          ...StyledTextFieldStyles,
          ...sx,
        }}
        thousandSeparator={thousandSeparator}
        variant={'outlined'}
        {...rest}
      />
    </>
  );
};
