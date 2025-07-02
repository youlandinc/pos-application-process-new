import { FC, useCallback, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, VisibilityOutlined } from '@mui/icons-material';

import { StyledTextFieldPasswordProps } from './index';
import { StyledTextField } from '@/components/atoms';

export const StyledTextFieldPassword: FC<StyledTextFieldPasswordProps> = ({
  value,

  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisibleClick = useCallback(() => {
    setVisible((old) => !old);
  }, []);

  return (
    <>
      <StyledTextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disableRipple
                edge="end"
                onClick={onToggleVisibleClick}
                tabIndex={-1}
              >
                {visible ? <VisibilityOutlined /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
          autoComplete: 'new-password',
          name: 'new-password',
        }}
        inputProps={{
          autoComplete: 'new-password',
          name: 'new-password',
        }}
        name={'new-password'}
        type={visible ? 'text' : 'password'}
        value={value}
        {...rest}
      />
    </>
  );
};
