import { FC, ReactNode, useRef, useState } from 'react';
import { Menu, MenuItem, Stack, SxProps } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useSessionStorageState } from '@/hooks';

import { OPTIONS_COMMON_YES_OR_NOT_SURE } from '@/constants';
import { LoanAnswerEnum } from '@/types';

import {
  StyledSelect,
  StyledTextField,
  StyledTextFieldNumber,
} from '@/components/atoms';

interface StyledSelectTextField {
  options?: Option[];
  selectLabel?: string;
  selectValue: string;
  onSelectChange: (value: string | number) => void;
  fieldLabel?: string;
  fieldValue: string | number | undefined;
  onFieldChange: (floatValue: number | undefined | any) => void;
  sx?: SxProps;
  percentage?: boolean;
  validate?: string[];
  tooltipTitle?: ReactNode;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
  fieldType?: 'number' | 'text';
}

export const StyledSelectTextField: FC<StyledSelectTextField> = ({
  options = OPTIONS_COMMON_YES_OR_NOT_SURE,
  selectLabel,
  selectValue,
  onSelectChange,
  fieldLabel,
  fieldValue,
  onFieldChange,
  sx,
  percentage = false,
  validate,
  tooltipTitle = '',
  tooltipSx = { width: '100%' },
  isTooltip = false,
  fieldType = 'number',
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = () => {
    setAnchorEl(wrapperRef.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const wrapperRef = useRef(null);

  return isTooltip ? (
    <Stack ref={wrapperRef} sx={sx} width={'100%'}>
      {selectValue === LoanAnswerEnum.yes ? (
        fieldType === 'number' ? (
          <StyledTextFieldNumber
            InputProps={{
              endAdornment: (
                <>
                  <ArrowDropDownIcon
                    onClick={handleClick}
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      width: 22,
                      height: 22,
                      transform: open ? 'rotate(.5turn)' : 'rotate(0)',
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={open}
                    sx={{
                      '.MuiPaper-root': {
                        mt: 1.5,
                        width: 220,
                        borderRadius: 2,
                      },
                      '.MuiList-root': {
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
                      },
                    }}
                    transitionDuration={300}
                  >
                    {options.map((item, index) => (
                      <MenuItem
                        key={`${item.label}-${index}`}
                        onClick={() => onSelectChange(item.value)}
                        selected={selectValue === item.value}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ),
            }}
            isTooltip={true}
            label={fieldLabel}
            onValueChange={({ floatValue }) => onFieldChange(floatValue)}
            percentage={percentage}
            prefix={percentage ? undefined : '$'}
            suffix={percentage ? '%' : undefined}
            sx={{
              '& .MuiInputBase-adornedEnd': {
                paddingRight: '8px !important',
              },
            }}
            tooltipSx={tooltipSx}
            tooltipTitle={tooltipTitle}
            validate={validate}
            value={fieldValue}
          />
        ) : (
          <StyledTextField
            InputProps={{
              endAdornment: (
                <>
                  <ArrowDropDownIcon
                    onClick={handleClick}
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      width: 22,
                      height: 22,
                      transform: open ? 'rotate(.5turn)' : 'rotate(0)',
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={open}
                    sx={{
                      '.MuiPaper-root': {
                        mt: 1.5,
                        width: 220,
                        borderRadius: 2,
                      },
                      '.MuiList-root': {
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
                      },
                    }}
                    transitionDuration={300}
                  >
                    {options.map((item, index) => (
                      <MenuItem
                        key={`${item.label}-${index}`}
                        onClick={() => onSelectChange(item.value)}
                        selected={selectValue === item.value}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ),
            }}
            isTooltip={true}
            label={fieldLabel}
            onChange={(e) => onFieldChange(e)}
            sx={{
              '& .MuiInputBase-adornedEnd': {
                paddingRight: '8px !important',
              },
            }}
            tooltipSx={tooltipSx}
            tooltipTitle={tooltipTitle}
            validate={validate}
            value={fieldValue}
          />
        )
      ) : (
        <StyledSelect
          isTooltip={true}
          label={selectLabel}
          onChange={(e) => {
            onSelectChange(e.target.value as unknown as string);
            handleClose();
          }}
          options={options}
          tooltipSx={tooltipSx}
          tooltipTitle={tooltipTitle}
          value={selectValue}
        />
      )}
    </Stack>
  ) : (
    <Stack ref={wrapperRef} sx={sx} width={'100%'}>
      {selectValue === LoanAnswerEnum.yes ? (
        fieldType === 'number' ? (
          <StyledTextFieldNumber
            InputProps={{
              endAdornment: (
                <>
                  <ArrowDropDownIcon
                    onClick={handleClick}
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      width: 22,
                      height: 22,
                      transform: open ? 'rotate(.5turn)' : 'rotate(0)',
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={open}
                    sx={{
                      '.MuiPaper-root': {
                        mt: 1.5,
                        width: 220,
                        borderRadius: 2,
                      },
                      '.MuiList-root': {
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
                      },
                    }}
                    transitionDuration={300}
                  >
                    {options.map((item, index) => (
                      <MenuItem
                        key={`${item.label}-${index}`}
                        onClick={() => onSelectChange(item.value)}
                        selected={selectValue === item.value}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ),
            }}
            label={fieldLabel}
            onValueChange={({ floatValue }) => onFieldChange(floatValue)}
            percentage={percentage}
            prefix={percentage ? undefined : '$'}
            suffix={percentage ? '%' : undefined}
            sx={{
              '& .MuiInputBase-adornedEnd': {
                paddingRight: '8px !important',
              },
            }}
            validate={validate}
            value={fieldValue}
          />
        ) : (
          <StyledTextField
            InputProps={{
              endAdornment: (
                <>
                  <ArrowDropDownIcon
                    onClick={handleClick}
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      width: 22,
                      height: 22,
                      transform: open ? 'rotate(.5turn)' : 'rotate(0)',
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={open}
                    sx={{
                      '.MuiPaper-root': {
                        mt: 1.5,
                        width: 220,
                        borderRadius: 2,
                      },
                      '.MuiList-root': {
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
                      },
                    }}
                    transitionDuration={300}
                  >
                    {options.map((item, index) => (
                      <MenuItem
                        key={`${item.label}-${index}`}
                        onClick={() => onSelectChange(item.value)}
                        selected={selectValue === item.value}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ),
            }}
            isTooltip={true}
            label={fieldLabel}
            onChange={(e) => onFieldChange(e)}
            sx={{
              '& .MuiInputBase-adornedEnd': {
                paddingRight: '8px !important',
              },
            }}
            tooltipSx={tooltipSx}
            tooltipTitle={tooltipTitle}
            validate={validate}
            value={fieldValue}
          />
        )
      ) : (
        <StyledSelect
          label={selectLabel}
          onChange={(e) => {
            onSelectChange(e.target.value as unknown as string);
            handleClose();
          }}
          options={options}
          value={selectValue}
        />
      )}
    </Stack>
  );
};
