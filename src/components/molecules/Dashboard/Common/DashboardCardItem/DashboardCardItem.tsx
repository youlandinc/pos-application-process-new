import { CSSProperties, FC, ReactNode } from 'react';
import { Stack, StackProps, Typography } from '@mui/material';
import { useBreakpoints } from '@/hooks';

interface DashboardCardItemProps extends StackProps {
  label: string | ReactNode;
  labelStyle?: CSSProperties;
  info: string | number | ReactNode;
  infoStyle?: CSSProperties;
}

export const DashboardCardItem: FC<DashboardCardItemProps> = ({
  label,
  info,
  labelStyle,
  infoStyle,
  ...rest
}) => {
  const breakpoint = useBreakpoints();
  return (
    <Stack
      alignItems={label === 'Address' ? 'flex-start' : 'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'100%'}
      {...rest}
    >
      <Typography
        color={'text.primary'}
        component={'div'}
        sx={labelStyle}
        variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'}
      >
        {label}
      </Typography>
      <Typography
        color={'text.primary'}
        component={'div'}
        maxWidth={'75%'}
        sx={infoStyle}
        textAlign={'right'}
        variant={
          ['xs', 'sm', 'md'].includes(breakpoint) ? 'subtitle3' : 'subtitle1'
        }
      >
        {info}
      </Typography>
    </Stack>
  );
};
