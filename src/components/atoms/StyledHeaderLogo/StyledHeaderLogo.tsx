import { FC, useMemo } from 'react';
import { Box } from '@mui/material';

import { StyledHeaderLogoProps, StyledHeaderLogoStyles } from './index';
import { useSessionStorageState } from '@/hooks';

import { POSFormatUrl } from '@/utils';

export const StyledHeaderLogo: FC<StyledHeaderLogoProps> = ({
  sx,
  logoUrl = '/images/logo/logo_blue.svg',
  disabled = false,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const Logo = useMemo(() => {
    if (saasState?.logoUrl) {
      return (
        <picture style={{ height: '100%' }}>
          <img alt="" height={'100%'} src={saasState?.logoUrl || logoUrl} />
        </picture>
      );
    }
    return <Box className={'logo_name'}>{saasState?.organizationName}</Box>;
  }, [logoUrl, saasState?.logoUrl, saasState?.organizationName]);

  return (
    <Box
      onClick={() => {
        if (disabled || !saasState?.website) {
          return;
        }
        const url = POSFormatUrl(saasState?.website);
        saasState?.website && (location.href = url);
      }}
      sx={{
        ...StyledHeaderLogoStyles,
        ...sx,
        cursor: saasState?.website ? 'pointer' : 'default',
      }}
    >
      {Logo}
    </Box>
  );
};
