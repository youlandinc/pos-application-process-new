import { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
} from '@mui/material';

import { StyledRadioGroupStyles, StyledStyledRadioProps } from './index';

import RADIO_CHECKED from './checked.svg';
import RADIO_STATIC from './static.svg';

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
          <FormControlLabel
            control={
              <Radio
                checkedIcon={<Icon component={RADIO_CHECKED} />}
                icon={<Icon component={RADIO_STATIC} />}
              />
            }
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
