import { FC } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import { StyledButtonGroupProps, StyledButtonGroupStyles } from './index';

export const StyledButtonGroup: FC<StyledButtonGroupProps> = ({
  color = 'primary',
  sx,
  value,
  options,
  ...rest
}) => {
  const breakpoints = useBreakpoints();

  return (
    <ToggleButtonGroup
      color={color}
      exclusive
      sx={{
        ...StyledButtonGroupStyles,
        ...sx,
      }}
      value={value}
      {...rest}
    >
      {options?.map((item, index) => (
        <ToggleButton
          disableRipple
          key={index}
          size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
          value={item.value}
        >
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
