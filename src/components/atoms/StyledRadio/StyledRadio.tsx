import { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import React from 'react';
import { StyledRadioStyles, StyledStyledRadioProps } from './index';

export const StyledRadio: FC<StyledStyledRadioProps> = ({
  sx,
  value,
  label,
  options,
  ...rest
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        sx={{
          ...StyledRadioStyles,
          ...sx,
        }}
        value={value}
        {...rest}
      >
        {options?.map((item, index) => (
          <FormControlLabel
            control={<Radio />}
            disabled={item.disabled}
            key={index}
            label={item.label}
            value={item.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
