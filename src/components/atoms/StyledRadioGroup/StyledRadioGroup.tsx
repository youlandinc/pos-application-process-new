import { FC } from 'react';

import { FormControl, FormLabel, RadioGroup } from '@mui/material';

import {
  StyledRadioGroupStyles,
  StyledRadioWithLabel,
  StyledStyledRadioProps,
} from './index';

export const StyledRadioGroup: FC<StyledStyledRadioProps> = ({
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
          ...StyledRadioGroupStyles,
          ...sx,
        }}
        value={value}
        {...rest}
      >
        {options?.map((item, index) => (
          <StyledRadioWithLabel
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
