import { FC } from 'react';
import { Dehaze } from '@mui/icons-material';

import {
  POSMenuList,
  SideDrawer,
  StyledBoxWrap,
  StyledButton,
} from '@/components';
import { useBreakpoints, useSwitch } from '@/hooks';
import { Box } from '@mui/material';
import { useMst } from '@/models/Root';
const POSMenuListPage: FC = () => {
  const { visible, open, close } = useSwitch();
  const breakpoint = useBreakpoints();
  const { selectedProcessData } = useMst();
  return (
    <>
      <StyledBoxWrap>
        {['xs', 'sm', 'md'].includes(breakpoint) ? (
          <StyledButton isIconButton onClick={open}>
            <Dehaze />
          </StyledButton>
        ) : (
          <Box sx={{ maxWidth: 280 }}>
            <POSMenuList
              info={selectedProcessData}
              scene={selectedProcessData.scene || 'bridge refinance'}
            />
          </Box>
        )}
      </StyledBoxWrap>
      <SideDrawer close={close} visible={visible} />
    </>
  );
};

export default POSMenuListPage;
