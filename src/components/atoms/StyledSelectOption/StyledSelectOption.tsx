import { FC, useCallback, useMemo } from 'react';
import { Box, Stack } from '@mui/material';

import { StyledSelectOptionProps, StyledSelectOptionStyles } from './index';

export const StyledSelectOption: FC<StyledSelectOptionProps> = ({
  options,
  value,
  onChange,
}) => {
  const handledSelectChange = useCallback(
    (optionValue: Option['value']) => () => {
      if (optionValue === value) {
        return;
      }
      onChange(optionValue);
    },
    [onChange, value],
  );

  const renderOptions = useMemo(() => {
    return (
      <>
        {options.map((opt) => (
          <Box
            className={value === opt.value ? 'active' : ''}
            key={opt.key}
            onClick={handledSelectChange(opt.value)}
            sx={StyledSelectOptionStyles}
          >
            {opt.label}
          </Box>
        ))}
      </>
    );
  }, [handledSelectChange, options, value]);

  return (
    <Stack alignItems={'center'} gap={3} justifyContent={'center'}>
      {renderOptions}
    </Stack>
  );
};
