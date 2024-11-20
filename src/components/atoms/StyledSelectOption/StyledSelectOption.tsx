import { FC, useCallback, useMemo } from 'react';
import { Box, Stack, SxProps } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import { StyledSelectOptionStyles } from './index';

import { StyledTooltip } from '@/components/atoms';

export interface StyledSelectOptionProps {
  options: Option[];
  onChange: (value: string | number) => void;
  value: string | number | unknown;
  disabled?: boolean;
  sx?: SxProps;
  tooltip?: boolean;
}

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
            leaveTouchDelay={0}
            placement={
              ['lg', 'xl', 'xxl'].includes(breakpoint) ? 'right' : 'top'
            }
            theme={'main'}
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
