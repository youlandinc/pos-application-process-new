import { CSSProperties, FC, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

import { POSFlex, POSFont } from '@/styles';

const productItemStyle = {
  '&.container': {
    ...POSFlex('', 'space-between', undefined),
    width: '100%',
  },
  '& .label': {
    ...POSFont({ md: 16, xs: 12 }, 400, 1.5, 'text.primary'),
  },
  '& .info': {
    ...POSFont({ md: 16, xs: 12 }, 600, 1.5, 'text.primary'),
    maxWidth: '75%',
    textAlign: 'right',
  },
} as const;

interface ProductItemProps extends BoxProps {
  label: string | ReactNode;
  labelStyle?: CSSProperties;
  info: string | number | ReactNode;
  infoStyle?: CSSProperties;
}

export const ProductItem: FC<ProductItemProps> = (props) => {
  const { label, info, labelStyle, infoStyle, ...rest } = props;

  return (
    <Box
      className={'container'}
      sx={{
        ...productItemStyle,
        alignItems: label === 'Address' ? 'flex-start' : 'center',
      }}
      {...rest}
    >
      <Box className={'label'} sx={labelStyle}>
        {label}
      </Box>
      <Box className={'info'} sx={infoStyle}>
        {info}
      </Box>
    </Box>
  );
};
