import { FC, forwardRef, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';

import { POSFormatDollar, POSFormatPercent, POSNotUndefined } from '@/utils';

import { StyledTextField, StyledTextFieldStyles } from '@/components/atoms';
import { SxProps, TextFieldProps } from '@mui/material';

export interface StyledTextFieldNumberProps {
  allowNegative?: boolean;
  onValueChange: (values: NumberFormatValues) => void;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  value: number | string | undefined;
  sx?: SxProps;
  required?: boolean;
  placeholder?: string;
  decimalScale?: number;
  disabled?: boolean;
  validate?: undefined | string[];
  percentage?: boolean;
  error?: boolean | undefined;
  size?: 'small' | 'medium';
  InputProps?: any;
  tooltipSx?: SxProps;
  tooltipTitle?: ReactNode;
  isTooltip?: boolean;
  InputLabelProps?: TextFieldProps['InputLabelProps'];
}

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
  const [text, setText] = useState(value ?? 0);

  const [fixedDecimalScale, setFixedDecimalScale] = useState(false);

  useEffect(() => {
    if (POSNotUndefined(value) && value) {
      if (thousandSeparator) {
        setText(
          percentage
            ? POSFormatPercent((value as number) / 100)
            : POSFormatDollar(value),
        );
      } else {
        setText(value);
      }
    } else {
      setText('');
    }
  }, [percentage, thousandSeparator, value]);

  const handledChange = (e: {
    target: { name: string; value: NumberFormatValues };
  }) => {
    onValueChange(e.target.value);
  };

  const reduceFixedDecimalScale = useMemo(() => {
    const isInteger = percentage
      ? Number.isInteger(text)
      : Number.isInteger(value);
    return isInteger ? false : fixedDecimalScale;
  }, [fixedDecimalScale, percentage, text, value]);

  return (
    <>
      <StyledTextField
        {...rest}
        id="formatted-numberformat-input"
        InputProps={{
          ...rest.InputProps,
          inputComponent: NumericFormatCustom as any,
        }}
        inputProps={{
          allowNegative,
          onValueChange,
          prefix,
          suffix,
          value,
          sx,
          decimalScale: decimalScale,
          thousandSeparator,
          fixedDecimalScale: reduceFixedDecimalScale,
          autoComplete: 'off',
        }}
        name="numberformat"
        onBlur={() => setFixedDecimalScale(true)}
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        onChange={handledChange}
        onFocus={() => setFixedDecimalScale(false)}
        sx={{
          ...StyledTextFieldStyles,
          ...sx,
        }}
        value={text}
        variant="outlined"
      />
    </>
  );
};

interface CustomProps {
  onChange: (event: {
    target: { name: string; value: NumberFormatValues };
  }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values,
            },
          });
        }}
        valueIsNumericString
        {...other}
      />
    );
  },
);
