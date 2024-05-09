import { FC, useEffect, useMemo, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFormatUrl, POSGetImageSize } from '@/utils';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { StyledButton, StyledDrawer } from '@/components/atoms';
import { DashboardMenuList } from '@/components/molecules';

interface DashboardSideDrawerProps {
  visible: boolean;
  close: () => void;
}

export const DashboardSideDrawer: FC<DashboardSideDrawerProps> = observer(
  ({ visible = false, close }) => {
    const breakpoint = useBreakpoints();
    const { dashboardInfo } = useMst();
    const { saasState } = useSessionStorageState('tenantConfig');

    const [ratio, setRatio] = useState(-1);

    const breakpoints = useBreakpoints();

    const Logo = useMemo(() => {
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
              src={saasState?.logoUrl || '/images/logo/logo_blue.svg'}
              style={{
                position: 'absolute',
                top: ['sm', 'xs', 'md'].includes(breakpoints) ? '50%' : 46,
                transform: ['sm', 'xs', 'md'].includes(breakpoints)
                  ? 'translateY(-50%)'
                  : 'none',
                left: ratio === 1 ? 24 : 0,
                zIndex: 1,
                maxHeight: 68,
                maxWidth: 200,
              }}
            />
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
    }, [breakpoints, ratio, saasState?.logoUrl, saasState?.organizationName]);

    useEffect(() => {
      if (saasState?.logoUrl) {
        POSGetImageSize(saasState?.logoUrl).then((res) => {
          setRatio(res?.ratio as number);
        });
      }
    }, [saasState?.logoUrl]);

    return (
      <StyledDrawer
        content={<DashboardMenuList info={dashboardInfo} />}
        disableEscapeKeyDown
        header={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 92,
            }}
          >
            <Box
              onClick={() => {
                if (!saasState?.website) {
                  return;
                }
                const url = POSFormatUrl(saasState?.website);
                saasState?.website && (location.href = url);
              }}
              sx={{
                position: 'relative',
                height: '100%',
                cursor: saasState?.website ? 'pointer' : 'default',
              }}
            >
              {Logo}
            </Box>
            <StyledButton
              color="info"
              isIconButton
              onClick={close}
              sx={{ p: 0 }}
            >
              <Close />
            </StyledButton>
          </Box>
        }
        open={['xs', 'sm', 'md'].includes(breakpoint) && visible}
        sx={{
          '&.MuiDrawer-root ': {
            '& .drawer_header': {
              py: 0,
              px: 1.5,
            },
            '& .drawer_content': {
              py: 3,
              px: 1.5,
            },
          },
        }}
      />
    );
  },
);
