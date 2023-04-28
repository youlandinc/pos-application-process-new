import React, { FC, useEffect, useState } from 'react';
import { NumberFormatValues, PatternFormat } from 'react-number-format';

import { StyledTextFieldPhoneProps, StyledTextFieldPhoneStyles } from './index';

import { StyledTextField } from '../StyledTextField';

export const StyledTextFieldPhone: FC<StyledTextFieldPhoneProps> = ({
  format = '(###) ###-####',
  mask = '_',
  value,
  onValueChange,
  sx,
  ...rest
}) => {
  const [text, setText] = useState<number | string>(value);

  useEffect(
    () => {
      if (value) {
        setText(value);
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
    <PatternFormat
      allowEmptyFormatting={true}
      customInput={StyledTextField}
      format={format}
      mask={mask}
      onValueChange={handledChange}
      sx={{
        ...StyledTextFieldPhoneStyles,
        ...sx,
      }}
      value={text}
      {...rest}
    />
  );
};
