import { FC } from 'react';
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
      sx={{
        ...StyledButtonGroupStyles,
        ...sx,
      }}
      value={value === undefined ? '' : value ? 'yes' : 'no'}
      {...rest}
    >
      {options?.map((item, index) => (
        <ToggleButton disableRipple key={index} value={item.value}>
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
