import { FC } from 'react';
import { Icon, Radio, RadioProps } from '@mui/material';
import { StyledRadioGroupStyles } from './StyledRadioGroupStyles';

import RADIO_CHECKED from './checked.svg';
import RADIO_STATIC from './static.svg';

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
