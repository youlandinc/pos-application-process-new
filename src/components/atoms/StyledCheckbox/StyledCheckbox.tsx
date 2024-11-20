import { POSFont } from '@/styles';
import { theme } from '@/theme';
import { FC } from 'react';
import { Checkbox, FormControlLabel, Icon } from '@mui/material';

import { useSessionStorageState } from '@/hooks';

import { StyledCheckboxProps } from './index';

import ICON_CHECKBOX_STATIC from './assets/icon_static.svg';
import ICON_CHECKBOX_CHECKED from './assets/icon_checked.svg';
import ICON_CHECKBOX_INDETERMINATE from './assets/icon_intermediate.svg';

export const StyledCheckbox: FC<StyledCheckboxProps> = ({
  checked = false,
  label,
  onChange,
  icon,
  checkedIcon,
  indeterminateIcon,
  indeterminate,
  sxCheckbox,
  sx,
  ...rest
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            checkedIcon={
              <Icon component={checkedIcon || ICON_CHECKBOX_CHECKED} />
            }
            disableRipple
            icon={<Icon component={icon || ICON_CHECKBOX_STATIC} />}
            indeterminate={indeterminate}
            indeterminateIcon={
              <Icon
                component={indeterminateIcon || ICON_CHECKBOX_INDETERMINATE}
              />
            }
            onChange={onChange}
            sx={{ ...sxCheckbox }}
            {...rest}
          />
        }
        label={label}
        sx={{
          alignItems: 'flex-start',
          // width: '100%',
          '& .MuiFormControlLabel-label': {
            width: '100%',
            ml: 1.5,
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            ...POSFont(14, 400, 1.5, 'text.primary'),
          },
          '& .Mui-checked': {
            '& svg > path': {
              fill: `hsla(${
                saasState?.posSettings?.h ?? 222
              },42%,55%,1) !important`,
            },
          },
          '& .MuiCheckbox-root': {
            mt: '-11px',
            mr: '-11px',
            '& svg > path': {
              fill: '#929292',
            },
          },
          '& .Mui-disabled': {
            '& svg > path': {
              fill: `${theme.palette.action.disabled} !important`,
            },
          },
          ...sx,
        }}
      />
    </>
  );
};
