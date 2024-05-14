import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import NOTIFICATION_ERROR from '@/components/atoms/StyledNotification/notification_error.svg';

export const ProductMessageList: FC<{
  errorList: Array<string | any>;
}> = ({ errorList }) => {
  return (
    <Stack bgcolor={'#F6EBE8'} borderRadius={2} gap={1.5} px={2} py={1.5}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={NOTIFICATION_ERROR} />
        <Typography color={'error.main'} variant={'subtitle2'}>
          Please fix the following
        </Typography>
      </Stack>

      <Stack component={'ul'} gap={1.5} sx={{ listStyle: 'outside', pl: 2 }}>
        {errorList.map((item, index) => (
          <Typography
            color={'error.hover'}
            component={'li'}
            key={`${item}-${index}`}
            variant={'body3'}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
