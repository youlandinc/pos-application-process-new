import { Transitions } from '@/components/atoms';
import { FC } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import { StyledSelectProps, StyledSelectStyles } from './index';

export const StyledSelect: FC<StyledSelectProps> = ({
  options = [],
  validate,
  value = '',
  onChange,
  label,
  disabled,
  sxList,
  sx,
  sxHelperText,
  required,
  ...rest
}) => {
  return (
    <>
      <FormControl
        error={!!(validate?.length && validate[0])}
        required={required}
        sx={{
          [disabled ? '& label' : '']: {
            color: 'text.disabled',
          },
          ...StyledSelectStyles.root,
          ...sx,
        }}
        variant={'outlined'}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disabled}
          inputProps={{
            MenuProps: {
              MenuListProps: {
                sx: { ...StyledSelectStyles.list, ...sxList },
              },
            },
          }}
          label={label}
          onChange={onChange}
          value={value}
          {...rest}
        >
          {options.map((opt) => (
            <MenuItem key={opt.key} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        <Transitions>
          {validate?.length && validate[0] && (
            <FormHelperText
              sx={{ ...StyledSelectStyles.helperText, ...sxHelperText }}
            >
              {validate?.length
                ? validate.map((item, index) => (
                    <Box
                      component={'span'}
                      key={item + '_' + index}
                      sx={{ display: 'block', m: 0 }}
                    >
                      {item}
                    </Box>
                  ))
                : validate
                ? validate[0]
                : undefined}
            </FormHelperText>
          )}
        </Transitions>
      </FormControl>
    </>
  );
};
