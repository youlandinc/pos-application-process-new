import { FC, useCallback, useMemo } from 'react';
import { Box, Stack } from '@mui/material';

import { StyledSelectOptionProps, StyledSelectOptionStyles } from './index';

export const StyledSelectOption: FC<StyledSelectOptionProps> = ({
  options,
  value,
  onChange,
  disabled = false,
}) => {
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
          <Box
            className={`${value === opt.value ? 'active' : ''} ${
              disabled ? 'disabled' : ''
            }`}
            key={opt.key}
            onClick={handledSelectChange(opt.value)}
            sx={StyledSelectOptionStyles}
          >
            {opt.label}
          </Box>
        ))}
      </>
    );
  }, [disabled, handledSelectChange, options, value]);

  return (
    <Stack alignItems={'center'} gap={3} justifyContent={'center'}>
      {renderOptions}
    </Stack>
  );
};
