import { FC } from 'react';
import { Checkbox, FormControlLabel, Icon } from '@mui/material';

import { StyledCheckboxClasses, StyledCheckboxProps } from './index';

import CHECKBOX_STATIC from './static.svg';
import CHECKBOX_CHECKED from './checked.svg';
import CHECKBOX_INDETERMINATE from './intermediate.svg';

export const StyledCheckbox: FC<StyledCheckboxProps> = ({
  checked = false,
  label,
  onChange,
  icon,
  checkedIcon,
  indeterminateIcon,
  indeterminate,
  ...rest
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            checkedIcon={<Icon component={checkedIcon || CHECKBOX_CHECKED} />}
            icon={<Icon component={icon || CHECKBOX_STATIC} />}
            indeterminate={indeterminate}
            indeterminateIcon={
              <Icon component={indeterminateIcon || CHECKBOX_INDETERMINATE} />
            }
            onChange={onChange}
            {...rest}
          />
        }
        label={label}
        sx={Object.assign({}, { ...StyledCheckboxClasses })}
      />
    </>
  );
};
