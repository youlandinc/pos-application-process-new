import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import { POSGetImageSize } from '@/utils';

interface StyledHeaderLogoProps {
  logoUrl?: string;
  organizationName?: string;
}

export const SpecificalPaymentLogo: FC<StyledHeaderLogoProps> = ({
  logoUrl,
  organizationName,
}) => {
  const [ratio, setRatio] = useState(-1);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const breakpoints = useBreakpoints();

  const Logo = useMemo(() => {
    if (isFirstLoading) {
      if (!logoUrl) {
        return (
          <Stack
            sx={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'primary.main',
              height: { md: 56, xs: 40 },
              justifyContent: 'flex-end',
              width: { xs: 160, xl: 225 },
            }}
          >
            {organizationName}
          </Stack>
        );
      }
      return;
    }
    if (logoUrl) {
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
            src={logoUrl}
            style={{
              position: 'absolute',
              top: ['sm', 'xs', 'md', 'lg'].includes(breakpoints) ? '50%' : 46,
              transform: ['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                ? 'translateY(-50%)'
                : 'none',
              left:
                ratio === 1 && !['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                  ? 44
                  : 0,
              zIndex: 1,
              maxHeight: ['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                ? 36
                : 68,
              maxWidth: ['sm', 'xs', 'md', 'lg'].includes(breakpoints)
                ? 160
                : 225,
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
          height: '100%',
          justifyContent: 'center',
          width: { xs: 160, xl: 225 },
        }}
      >
        {organizationName}
      </Stack>
    );
  }, [breakpoints, isFirstLoading, logoUrl, organizationName, ratio]);

  useEffect(() => {
    if (logoUrl) {
      POSGetImageSize(logoUrl).then((res) => {
        setRatio(res?.ratio as number);
        setIsFirstLoading(false);
      });
    }
  }, [logoUrl]);

  return (
    <Box
      sx={{
        height: '100%',
        width: 0,
        position: 'relative',
      }}
    >
      {Logo}
    </Box>
  );
};
