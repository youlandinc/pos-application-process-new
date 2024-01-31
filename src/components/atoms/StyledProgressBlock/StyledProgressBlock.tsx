import { FC } from 'react';
import { Typography } from '@mui/material';

interface StyledProgressBlockProps {
  total: number;
  current: number;
}

export const StyledProgressBlock: FC<StyledProgressBlockProps> = ({
  total,
  current,
}) => {
  return (
    <Typography
      alignItems={'center'}
      bgcolor={'#9095A3'}
      borderRadius={1}
      color={'white'}
      component={'div'}
      display={'flex'}
      flexShrink={0}
      justifyContent={'center'}
      maxHeight={24}
      p={'4px 12px'}
      sx={{
        '&:hover': {
          bgcolor: '#9095A3 !important',
        },
      }}
      variant={'subtitle3'}
    >
      {current}/{total}
    </Typography>
  );
};
