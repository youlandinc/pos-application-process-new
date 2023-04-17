import React, { FC } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { StyledButtonGroupProps, StyledButtonGroupStyles } from './index';

export const StyledButtonGroup: FC<StyledButtonGroupProps> = ({
  color = 'primary',
  sx,
  value,
  options,
  ...rest
}) => {
  return (
    <ToggleButtonGroup
      color={color}
      exclusive
      sx={Object.assign(
        {},
        {
          ...StyledButtonGroupStyles,
          ...sx,
        },
      )}
      value={value}
      {...rest}
    >
      {options?.map((item, index) => (
        <ToggleButton key={index} value={item.value}>
          {item.value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
