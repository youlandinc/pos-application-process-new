import { FC, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import { POSFormatDollar, POSFormatPercent } from '@/utils';

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
  percentage = false,
  ...rest
}) => {
  const [text, setText] = useState(value);

  useEffect(
    () => {
      if (value) {
        setText(percentage ? POSFormatPercent(value) : POSFormatDollar(value));
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
