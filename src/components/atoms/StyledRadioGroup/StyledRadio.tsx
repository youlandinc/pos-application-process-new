import { FC } from 'react';
import { FormControlLabel, Icon, Radio, RadioProps } from '@mui/material';

import { StyledRadioGroupStyles, StyledRadioProps } from './index';

import RADIO_CHECKED from './checked.svg';
import RADIO_STATIC from './static.svg';

export const StyledRadio: FC<RadioProps> = ({ sx, ...rest }) => {
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

export const StyledRadioWithLabel: FC<StyledRadioProps> = ({
  label,
  value,
  disabled,
  ...rest
}) => {
  return (
    <FormControlLabel
      control={<StyledRadio {...rest} />}
      disabled={disabled}
      label={label}
      value={value}
    />
  );
};
