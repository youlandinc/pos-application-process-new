import { CSSProperties, FC, ReactNode } from 'react';
import { Box, Stack, StackProps } from '@mui/material';

import { POSFont } from '@/styles';

interface DashboardProductItemProps extends StackProps {
  label: string | ReactNode;
  labelStyle?: CSSProperties;
  info: string | number | ReactNode;
  infoStyle?: CSSProperties;
}

export const DashboardProductItem: FC<DashboardProductItemProps> = ({
  label,
  info,
  labelStyle,
  infoStyle,
  ...rest
}) => {
  return (
    <Stack
      alignItems={label === 'Address' ? 'flex-start' : 'center'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      width={'100%'}
      {...rest}
    >
      <Box
        sx={{
          ...POSFont({ md: 16, xs: 12 }, 400, 1.5, 'text.primary'),
          ...labelStyle,
        }}
      >
        {label}
      </Box>
      <Box
        className={'info'}
        sx={{
          ...POSFont({ md: 16, xs: 12 }, 600, 1.5, 'text.primary'),
          maxWidth: '75%',
          textAlign: 'right',
          ...infoStyle,
        }}
      >
        {info}
      </Box>
    </Stack>
  );
};
