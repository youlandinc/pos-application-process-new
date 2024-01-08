import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import { SceneType } from '@/types';

import {
  StyledButton,
  StyledDrawer,
  StyledHeaderLogo,
} from '@/components/atoms';
import { DashboardMenuList } from '@/components/molecules';

interface DashboardSideDrawerProps {
  visible: boolean;
  close: () => void;
}

export const DashboardSideDrawer: FC<DashboardSideDrawerProps> = observer(
  ({ visible = false, close }) => {
    const breakpoint = useBreakpoints();
    const { selectedProcessData } = useMst();
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
            <StyledHeaderLogo />
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
