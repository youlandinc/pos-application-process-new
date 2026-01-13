import { FC } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import { StyledTextField, StyledTextFieldProps } from '@/components/atoms';

export interface StyledTextFieldNumberProps
  extends Omit<
    StyledTextFieldProps,
    'value' | 'onChange' | 'type' | 'defaultValue'
  > {
  allowNegative?: boolean;
  onValueChange: (values: NumberFormatValues) => void;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  value: number | string | undefined;
  decimalScale?: number;
  percentage?: boolean;
}

export const StyledTextFieldNumber: FC<StyledTextFieldNumberProps> = ({
  allowNegative = false,
  onValueChange,
  thousandSeparator = true,
  decimalScale = 2,
  percentage = false,
  value,
  ...rest
}) => {
  return (
    <NumericFormat
      {...rest}
      allowNegative={allowNegative}
      autoComplete="off"
      customInput={StyledTextField}
      decimalScale={decimalScale}
      fixedDecimalScale={percentage}
      onValueChange={onValueChange}
      thousandSeparator={thousandSeparator}
      value={value ?? ''}
    />
  );
};
