import { StyledBadge, StyledButton } from '@/components';
import { POSFlex } from '@/styles';
import { UserType } from '@/types';
import { POSFormatDollar, POSFormatPercent } from '@/utils';
import {
  DeleteForeverOutlined,
  MoreVertOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import {
  FC,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';

import { LoanItemCardProps } from './index';

export const LoanItemCard: FC<LoanItemCardProps> = ({ formData, userType }) => {
  const [popperVisible, setPopperVisible] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const {
    address,
    productType,
    loanAmount,
    applicationTime,
    loanStage,
    brokerOriginationFee,
    brokerProcessingFee,
    brokerPoints,
    officerOriginationFee,
    officerProcessingFee,
    officerPoints,
    agentFee,
  } = formData;

  const [line_1, line_2] = address.split('NEW_LINE');

  const handledClose = useCallback((event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setPopperVisible(false);
  }, []);

  const handledClick = useCallback(() => setPopperVisible((open) => !open), []);

  const handledMenuItemClick = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      handledClose(e);
    },
    [handledClose],
  );

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px solid #D2D6E1',
        width: {
          xxl: 'calc(33% - 11.5px)',
          xl: 'calc(32.95% - 11.5px)',
          md: 'calc(50% - 12px)',
          xs: '100%',
        },
        transition: 'all .3s',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Box>
          <Typography variant={'subtitle1'}>{line_1}</Typography>
          <Typography variant={'subtitle1'}>{line_2}</Typography>
        </Box>
        <StyledButton
          color={'info'}
          isIconButton
          onClick={handledClick}
          ref={anchorRef}
        >
          <MoreVertOutlined />
        </StyledButton>
        <Popper
          anchorEl={anchorRef.current}
          disablePortal
          open={popperVisible}
          placement={'bottom-start'}
          sx={{ position: 'relative', zIndex: 1000 }}
          transition
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'top',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handledClose}>
                  <MenuList sx={{ mt: 1.5, width: 180 }}>
                    <MenuItem sx={{ width: '100%' }}>
                      <Icon
                        className={'POS_mr_3'}
                        component={RemoveRedEyeOutlined}
                      />
                      View
                    </MenuItem>
                    <MenuItem sx={{ width: '100%' }}>
                      <Icon
                        className={'POS_mr_3'}
                        component={DeleteForeverOutlined}
                      />
                      Delete
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          '& .product_item': {
            ...POSFlex('center', 'space-between', 'row'),
            mt: 3,
            '&:first-of-type': {
              mt: 0,
            },
          },
        }}
      >
        <Box className={'product_item'}>
          <Box>Loan Type</Box>
          <Typography variant={'subtitle1'}>{productType}</Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Loan Amount</Box>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(loanAmount)}
          </Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Application Date</Box>
          <Typography variant={'subtitle1'}>
            {format(new Date(applicationTime), 'MM/dd/yyyy')}
          </Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Stage</Box>
          <StyledBadge content={loanStage} status={loanStage} />
        </Box>
        {(userType === UserType.BROKER ||
          userType === UserType.LOAN_OFFICER) && (
          <>
            {' '}
            <Box className={'product_item'}>
              <Box>Origination Fee</Box>
              <Typography variant={'subtitle1'}>
                {POSFormatPercent(brokerPoints / 100)}
              </Typography>
            </Box>
            <Box className={'product_item'}>
              <Box>Processing Fee</Box>
              <Typography variant={'subtitle1'}>
                {POSFormatDollar(brokerProcessingFee)}
              </Typography>
            </Box>
          </>
        )}

        {userType === UserType.REAL_ESTATE_AGENT && (
          <Box className={'product_item'}>
            <Box>Referral Fee</Box>
            <Typography variant={'subtitle1'}>
              {POSFormatDollar(agentFee)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
