import { FC, ReactNode, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
} from '@mui/material';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { StyledSelectStyles } from './index';

import { StyledTooltip, Transitions } from '@/components/atoms';

export interface StyledSelectProps extends SelectProps {
  validate?: undefined | string[];
  options: Option[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
  tooltipTitle?: ReactNode;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
}

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
  tooltipTitle = '',
  tooltipSx = { width: '100%' },
  isTooltip = false,
  ...rest
}) => {
  const breakpoints = useBreakpoints();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [open, setOpen] = useState(false);

  return isTooltip ? (
    <StyledTooltip
      forSelectState={open}
      mode={'for-select'}
      placement={'top'}
      theme={'main'}
      title={tooltipTitle}
      tooltipSx={tooltipSx}
    >
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
                  '& .Mui-selected:hover': {
                    bgcolor: `hsla(${
                      saasState?.posSettings?.h ?? 222
                    },100%,92%,1) !important`,
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: 14,
                    color: 'text.primary',
                    p: 1.5,
                  },
                  ...sxList,
                },
              },
              PaperProps: {
                style: { marginTop: 12, borderRadius: 8 },
              },
            },
          }}
          label={label}
          MenuProps={{
            disableScrollLock: true,
          }}
          onChange={onChange}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={value}
          {...rest}
          // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
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
                      sx={{
                        display: 'block',
                        m: 0,
                        pl: 0.5,
                        '&:first-of-type': { mt: 0.5 },
                      }}
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
    </StyledTooltip>
  ) : (
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
                '& .Mui-selected:hover': {
                  bgcolor: `hsla(${
                    saasState?.posSettings?.h ?? 222
                  },100%,92%,1) !important`,
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  color: 'text.primary',
                  p: 1.5,
                },
                ...sxList,
              },
            },
            PaperProps: {
              style: { marginTop: 12, borderRadius: 8 },
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
        // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
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
                    sx={{
                      display: 'block',
                      m: 0,
                      pl: 0.5,
                      '&:first-of-type': { mt: 0.5 },
                    }}
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
  );
};
