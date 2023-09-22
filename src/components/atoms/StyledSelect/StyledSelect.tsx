import { Transitions } from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';
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
  const { saasState } = useSessionStorageState('tenantConfig');

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
                sx: {
                  p: 0,
                  m: 0,
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: 'rgba(144, 149, 163, 0.1) !important',
                  },
                  '& .Mui-selected': {
                    bgcolor: `hsla(${
                      saasState?.posSettings?.h ?? 222
                    },100%,95%,1) !important`,
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: 14,
                    color: 'text.primary',
                  },
                  ...sxList,
                },
              },
              PaperProps: {
                style: { marginTop: 12 },
              },
            },
          }}
          label={label}
          MenuProps={{
            disableScrollLock: true,
          }}
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
