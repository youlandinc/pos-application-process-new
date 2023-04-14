import { FC, useCallback, useEffect, useState } from 'react';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, VisibilityOutlined } from '@mui/icons-material';

import {
  StyledTextField,
  StyledTextFieldPasswordProps,
  StyledTextFieldPasswordStyles,
} from '@/components/atoms';

export const StyledTextFieldPassword: FC<StyledTextFieldPasswordProps> = ({
  value,
  isCheck = true,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<{
    lengthError: boolean;
    letterError: boolean;
    numberError: boolean;
    noSpaceError: boolean;
  }>({
    lengthError: false,
    letterError: false,
    numberError: false,
    noSpaceError: false,
  });

  const onToggleVisibleClick = useCallback(() => {
    setVisible((old) => !old);
  }, []);

  useEffect(() => {
    const lengthError = (value as string)?.length >= 8;
    const noSpaceError = value.indexOf(' ') <= 0;
    const numberError = !!value.match(/\d/g);
    const letterError = !!value.match(/[a-zA-Z]/g);
    setPasswordError({
      lengthError,
      noSpaceError,
      letterError,
      numberError,
    });
  }, [value]);

  return (
    <>
      <StyledTextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={onToggleVisibleClick}
                tabIndex={-1}
              >
                {visible ? <VisibilityOutlined /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        type={visible ? 'text' : 'password'}
        value={value}
        {...rest}
      />
      <Box sx={{ mt: 1, mb: 3 }}>
        {!!value && isCheck && (
          <Box
            component={'ul'}
            sx={{ ...StyledTextFieldPasswordStyles.passwordTips }}
          >
            <Box
              className={passwordError.lengthError ? 'pass' : 'error'}
              component={'li'}
            >
              8 characters minimum
            </Box>
            <Box
              className={passwordError.noSpaceError ? 'pass' : 'error'}
              component={'li'}
            >
              Cannot contain spaces
            </Box>
            <Box
              className={passwordError.letterError ? 'pass' : 'error'}
              component={'li'}
            >
              At least one letter
            </Box>
            <Box
              className={passwordError.numberError ? 'pass' : 'error'}
              component={'li'}
            >
              At least one number
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
