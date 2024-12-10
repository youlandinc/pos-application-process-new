import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';

import { StyledHeaderLogoProps } from './index';
import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { POSFormatUrl, POSGetImageSize } from '@/utils';
import { LayoutSceneTypeEnum } from '@/types';

export const StyledHeaderLogo: FC<StyledHeaderLogoProps> = ({
  sx,
  logoUrl = '/images/logo/logo_blue.svg',
  disabled = false,
  scene = LayoutSceneTypeEnum.dashboard,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');
  const [ratio, setRatio] = useState(-1);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const breakpoints = useBreakpoints();

  const Logo = useMemo(() => {
    if (isFirstLoading) {
      if (!saasState?.logoUrl) {
        return (
          <Stack
            sx={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'primary.main',
              height: { md: 56, xs: 40 },
              width: { xs: 120, lg: 160, xl: 225 },
              mt: 3,
            }}
          >
            {saasState?.organizationName}
          </Stack>
        );
      }
      return;
    }
    if (saasState?.logoUrl) {
      return (
        <picture
          style={{
            display: 'block',
            height: '100%',
            position: 'relative',
            width: 0,
          }}
        >
          <img
            alt=""
            height={'auto'}
            src={saasState?.logoUrl || logoUrl}
            style={{
              position: 'absolute',
              top: '50%',
              //['sm', 'xs', 'md', 'lg'].includes(breakpoints) ||
              //scene === LayoutSceneTypeEnum.dashboard
              //  ? '50%'
              //  : 46,
              transform: 'translateY(-50%)',
              //['sm', 'xs', 'md', 'lg'].includes(breakpoints) ||
              //scene === LayoutSceneTypeEnum.dashboard
              //  ? 'translateY(-50%)'
              //  : 'none',
              left:
                ratio === 1 && !['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                  ? 44
                  : 0,
              zIndex: 1,
              maxHeight: ['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                ? 36
                : 40,
              maxWidth: ['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                ? 120
                : 180,
            }}
          />
        </picture>
      );
    }
    return (
      <Stack
        sx={{
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.5,
          color: 'primary.main',
          height: { md: 56, xs: 40 },
          width: { xs: 120, lg: 160, xl: 225 },
          mt: 3,
        }}
      >
        {saasState?.organizationName}
      </Stack>
    );
  }, [
    breakpoints,
    isFirstLoading,
    logoUrl,
    ratio,
    saasState?.logoUrl,
    saasState?.organizationName,
  ]);

  useEffect(() => {
    if (saasState?.logoUrl) {
      POSGetImageSize(saasState?.logoUrl).then((res) => {
        setRatio(res?.ratio as number);
        setIsFirstLoading(false);
      });
    }
  }, [saasState?.logoUrl]);

  //const computedHeight = useMemo(() => {
  //  switch (true) {
  //    case ratio < 1:
  //      return { md: '80px', xs: 'calc(100% - 48px)' };
  //    case ratio === 1:
  //      return { md: '80px', xs: 'calc(100% - 60px)' };
  //    case ratio > 1:
  //      return { md: 'calc(100% - 48px)', xs: 'calc(100% - 60px)' };
  //    case ratio === -1:
  //      return { md: 32, xs: 24 };
  //    default:
  //      return { md: 32, xs: 24 };
  //  }
  //}, [ratio]);

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
        height: '100%',
        width: 0,
        cursor: saasState?.website ? 'pointer' : 'default',
        position: 'relative',
        ...sx,
      }}
    >
      {Logo}
    </Box>
  );
};
