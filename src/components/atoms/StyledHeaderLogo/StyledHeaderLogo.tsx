import { FC, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';

import { StyledHeaderLogoProps } from './index';
import { useSessionStorageState } from '@/hooks';

import { POSFormatUrl, POSGetImageSize } from '@/utils';

export const StyledHeaderLogo: FC<StyledHeaderLogoProps> = ({
  sx,
  logoUrl = '/images/logo/logo_blue.svg',
  disabled = false,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');
  const [ratio, setRatio] = useState(-1);

  const Logo = useMemo(() => {
    if (saasState?.logoUrl) {
      return (
        <picture style={{ height: '100%' }}>
          <img alt="" height={'100%'} src={saasState?.logoUrl || logoUrl} />
        </picture>
      );
    }
    return (
      <Box
        sx={{
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.5,
          color: 'primary.main',
        }}
      >
        {saasState?.organizationName}
      </Box>
    );
  }, [logoUrl, saasState?.logoUrl, saasState?.organizationName]);

  useEffect(() => {
    if (saasState?.logoUrl) {
      POSGetImageSize(saasState?.logoUrl).then((res) => {
        setRatio(res?.ratio as number);
      });
    }
  }, [saasState?.logoUrl]);

  const computedHeight = useMemo(() => {
    switch (true) {
      case ratio < 1:
        return { md: '80px', xs: 'calc(100% - 48px)' };
      case ratio === 1:
        return { md: '80px', xs: 'calc(100% - 60px)' };
      case ratio > 1:
        return { md: 'calc(100% - 48px)', xs: 'calc(100% - 60px)' };
      case ratio === -1:
        return { md: 32, xs: 24 };
      default:
        return { md: 32, xs: 24 };
    }
  }, [ratio]);

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
        position: 'relative',
        height: computedHeight,
        ...sx,
        cursor: saasState?.website ? 'pointer' : 'default',
        mt: { md: ratio <= 1 ? 4 : 0, xs: 0 },
      }}
    >
      {Logo}
    </Box>
  );
};
