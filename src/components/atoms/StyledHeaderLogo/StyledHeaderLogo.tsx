import { FC, useMemo } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { StyledHeaderLogoProps, StyledHeaderLogoStyles } from './index';
import { useSessionStorageState } from '@/hooks';

export const StyledHeaderLogo: FC<StyledHeaderLogoProps> = ({
  sx,
  logoUrl = '/images/logo/logo_blue.svg',
}) => {
  const router = useRouter();
  const { state } = useSessionStorageState('tenantConfig');

  const Logo = useMemo(() => {
    if (state?.logoUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt="" height={'100%'} src={state?.logoUrl || logoUrl} />;
    }
    return <Box className={'logo_name'}>{state?.organizationName}</Box>;
  }, [logoUrl, state?.logoUrl, state?.organizationName]);

  return (
    <Box
      onClick={() => router.push('/')}
      sx={{ ...StyledHeaderLogoStyles, ...sx }}
    >
      {Logo}
      {/* <Image
        alt=""
        fill
        priority
        src={state?.logoUrl || logoUrl}
        style={{ maxWidth: 180 }}
      /> */}
    </Box>
  );
};
