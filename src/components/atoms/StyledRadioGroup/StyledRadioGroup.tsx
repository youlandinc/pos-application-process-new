import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from '@mui/material';
import { FC } from 'react';

import {
  StyledRadioGroupStyles,
  StyledRadioProps,
  StyledStyledRadioProps,
} from './index';

import { StyledRadio } from './StyledRadio';

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

export const StyledRadioWithLabel: FC<StyledRadioProps> = (props) => {
  const { label, value, disabled, ...rest } = props;
  return (
    <FormControlLabel
      control={<StyledRadio {...rest} />}
      disabled={disabled}
      label={label}
      value={value}
    />
  );
};
