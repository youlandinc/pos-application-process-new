import { FC, useEffect, useMemo, useState } from 'react';
import { Close } from '@mui/icons-material';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFormatUrl, POSGetImageSize } from '@/utils';

import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { SceneType } from '@/types';

import { StyledButton, StyledDrawer } from '@/components/atoms';
import { DashboardMenuList } from '@/components/molecules';

interface DashboardSideDrawerProps {
  visible: boolean;
  close: () => void;
}

export const DashboardSideDrawer: FC<DashboardSideDrawerProps> = observer(
  ({ visible = false, close }) => {
    const breakpoint = useBreakpoints();
    const { selectedProcessData } = useMst();
    const { saasState } = useSessionStorageState('tenantConfig');

    const [ratio, setRatio] = useState(-1);

    const Logo = useMemo(() => {
      if (saasState?.logoUrl) {
        const width = 51 * ratio;
        return (
          <picture style={{ height: '100%' }}>
            <img
              alt=""
              height={width > 240 ? 'auto' : '100%'}
              src={saasState?.logoUrl || '/images/logo/logo_blue.svg'}
              width={width > 240 ? 240 : 'auto'}
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
    }, [ratio, saasState?.logoUrl, saasState?.organizationName]);

    useEffect(() => {
      if (saasState?.logoUrl) {
        POSGetImageSize(saasState?.logoUrl).then((res) => {
          setRatio(res?.ratio as number);
        });
      }
    }, [saasState?.logoUrl]);

    return (
      <StyledDrawer
        content={
          <>
            <DashboardMenuList
              info={selectedProcessData}
              scene={selectedProcessData.scene || SceneType.bridge_purchase}
            />
          </>
        }
        disableEscapeKeyDown
        header={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
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
              py: 2.5,
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
