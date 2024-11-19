import { FC, useCallback, useMemo } from 'react';
import { Box, Stack } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import { StyledSelectOptionProps, StyledSelectOptionStyles } from './index';

import { StyledTooltip } from '@/components/atoms';

export const StyledSelectOption: FC<StyledSelectOptionProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  sx,
}) => {
  const breakpoint = useBreakpoints();
  const handledSelectChange = useCallback(
    (optionValue: Option['value']) => () => {
      if (optionValue === value || disabled) {
        return;
      }
      onChange(optionValue);
    },
    [disabled, onChange, value],
  );

  const renderOptions = useMemo(() => {
    return (
      <>
        {options.map((opt) => (
          <StyledTooltip
            key={opt.key}
            placement={
              ['lg', 'xl', 'xxl'].includes(breakpoint) ? 'right' : 'top'
            }
            title={opt.tooltip}
          >
            <Box
              className={`${value === opt.value ? 'active' : ''} ${
                disabled ? 'disabled' : ''
              }`}
              onClick={handledSelectChange(opt.value)}
              sx={StyledSelectOptionStyles}
            >
              {opt.label}
            </Box>
          </StyledTooltip>
        ))}
      </>
    );
  }, [breakpoint, disabled, handledSelectChange, options, value]);

  return (
    <Stack
      alignItems={'center'}
      gap={{ xs: 1.5, lg: 3 }}
      justifyContent={'center'}
      sx={sx}
      width={'100%'}
    >
      {renderOptions}
    </Stack>
  );
};
