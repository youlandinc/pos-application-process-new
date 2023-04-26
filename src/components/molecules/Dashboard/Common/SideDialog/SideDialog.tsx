import { FC, forwardRef } from 'react';
import { Close } from '@mui/icons-material';

import { Box, Slide, SxProps } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  POSMenuList,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
} from '@/components';
import { useBreakpoints } from '@/hooks';
import { TransitionProps } from '@mui/material/transitions';

type SideDialogProps = {
  visible: boolean;
  close: () => void;
};

const SideDialogStyles: SxProps = {
  '&.MuiDialog-root ': {
    '& .dialog_header': {
      py: 4.25,
      px: 1.5,
    },
    '& .dialog_content': {
      py: 3,
      px: 1.5,
    },
  },
} as const;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const SideDialog: FC<SideDialogProps> = observer(
  ({ visible = false, close }) => {
    const breakpoint = useBreakpoints();
    const { selectedProcessData } = useMst();
    return (
      <StyledDialog
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
        sx={SideDialogStyles}
        TransitionComponent={Transition}
      />
    );
  },
);
