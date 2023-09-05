import { FormControlLabel, Icon, Radio, RadioProps } from '@mui/material';
import { FC } from 'react';
import { StyledRadioGroupStyles } from './StyledRadioGroupStyles';

import RADIO_CHECKED from './checked.svg';
import RADIO_STATIC from './static.svg';
import { StyledRadioProps } from './StyledRadioGroup.types';

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
