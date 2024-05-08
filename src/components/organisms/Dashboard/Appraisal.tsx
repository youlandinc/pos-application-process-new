import { FC } from 'react';
import { Stack } from '@mui/material';
import { StyledFormItem, StyledLoading } from '@/components/atoms';

export const Appraisal: FC = () => {
  return (
    <StyledFormItem
      gap={3}
      justifyContent={'flex-start'}
      label={'Your tasks checklist'}
      labelSx={{ m: 0 }}
      maxWidth={900}
      mx={{ lg: 'auto', xs: 0 }}
      px={{ lg: 3, xs: 0 }}
    ></StyledFormItem>
  );
  // loading ? (
  //   <Stack
  //     alignItems={'center'}
  //     justifyContent={'center'}
  //     margin={'auto 0'}
  //     minHeight={'calc(667px - 46px)'}
  //     width={'100%'}
  //   >
  //     <StyledLoading sx={{ color: 'text.grey' }} />
  //   </Stack>
  // ) : (
  //   <StyledFormItem
  //     gap={3}
  //     justifyContent={'flex-start'}
  //     label={'Your tasks checklist'}
  //     labelSx={{ m: 0 }}
  //     maxWidth={900}
  //     mx={{ lg: 'auto', xs: 0 }}
  //     px={{ lg: 3, xs: 0 }}
  //   ></StyledFormItem>
  // );
};
