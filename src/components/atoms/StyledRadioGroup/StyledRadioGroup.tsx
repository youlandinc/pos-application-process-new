import { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
  RadioProps,
} from '@mui/material';

import {
  StyledRadioGroupStyles,
  StyledRadioProps,
  StyledStyledRadioProps,
} from './index';

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

export const StyledRadio: FC<RadioProps> = (props) => {
  const { sx, ...rest } = props;
  return (
    <Radio
      checkedIcon={<Icon component={RADIO_CHECKED} />}
      icon={<Icon component={RADIO_STATIC} />}
      sx={{
        ...StyledRadioGroupStyles,
        ...sx,
      }}
      {...rest}
    />
  );
};

export const StyledRadioWithLabel: FC<StyledRadioProps> = (props) => {
  const { label, ...rest } = props;
  return (
    <FormControl>
      <FormControlLabel
        control={<StyledRadio {...rest} />}
        label={label}
      ></FormControlLabel>
    </FormControl>
  );
};
