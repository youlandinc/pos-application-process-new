import { FC } from 'react';
import { Close } from '@mui/icons-material';

import { Box, SxProps } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  POSMenuList,
  StyledButton,
  StyledDrawer,
  StyledHeaderLogo,
} from '@/components';
import { useBreakpoints } from '@/hooks';

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
            <POSMenuList
              info={selectedProcessData}
              scene={selectedProcessData.scene || 'bridge refinance'}
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
