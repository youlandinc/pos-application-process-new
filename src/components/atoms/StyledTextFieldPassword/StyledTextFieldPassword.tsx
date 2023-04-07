import { FC, useCallback, useState } from 'react';
import { Box, IconButton, InputAdornment } from '@mui/material';

import {
  StyledTextField,
  StyledTextFieldPasswordProps,
  StyledTextFieldPasswordClasses,
} from '@/components/atoms';
import { VisibilityOff, VisibilityOutlined } from '@mui/icons-material';

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
        {!!value && (
          <Box component={'ul'} sx={{ pl: 2 }}>
            <Box
              component={'li'}
              sx={{ ...StyledTextFieldPasswordClasses.passwordTips }}
            >
              8 characters minimum
            </Box>
            <Box
              component={'li'}
              sx={{ ...StyledTextFieldPasswordClasses.passwordTips }}
            >
              Cannot contain spaces
            </Box>
            <Box
              component={'li'}
              sx={{ ...StyledTextFieldPasswordClasses.passwordTips }}
            >
              At least one letter
            </Box>
            <Box
              component={'li'}
              sx={{ ...StyledTextFieldPasswordClasses.passwordTips }}
            >
              At least one number
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
