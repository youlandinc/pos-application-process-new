import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box, SxProps } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledDrawer,
  StyledHeaderLogo,
} from '@/components/atoms';
import { DashboardMenuList } from '@/components/molecules';
import { useBreakpoints } from '@/hooks';
import { SceneType } from '@/types';

type SideDrawerProps = {
  visible: boolean;
  close: () => void;
};

const SideDrawerStyles: SxProps = {
  '&.MuiDrawer-root ': {
    '& .drawer_header': {
      py: 4.25,
      px: 1.5,
    },
    '& .drawer_content': {
      py: 3,
      px: 1.5,
    },
  },
} as const;

export const SideDrawer: FC<SideDrawerProps> = observer(
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
          <Box className={'POS_flex POS_jc_sb'}>
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
        sx={SideDrawerStyles}
      />
    );
  },
);
