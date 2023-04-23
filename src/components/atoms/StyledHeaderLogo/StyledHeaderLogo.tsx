import { FC } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { StyledHeaderLogoProps, StyledHeaderLogoStyles } from './index';

export const StyledHeaderLogo: FC<StyledHeaderLogoProps> = ({
  sx,
  logoUrl = '/images/logo/logo_blue.svg',
}) => {
  const router = useRouter();
  return (
    <Box
      onClick={() => router.push('/')}
      sx={{ ...StyledHeaderLogoStyles, ...sx }}
    >
      <Image alt="" fill priority src={logoUrl} />
    </Box>
  );
};
