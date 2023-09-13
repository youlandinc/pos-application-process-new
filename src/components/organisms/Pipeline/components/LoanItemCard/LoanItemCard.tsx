import {
  FC,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
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
import {
  DeleteForeverOutlined,
  MoreVertOutlined,
  RemoveRedEyeOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { POSFlex } from '@/styles';
import { LoanStage, LoanType, UserType } from '@/types';
import { POSFormatDollar, POSFormatPercent } from '@/utils';

import { StyledBadge, StyledButton } from '@/components/atoms';

export interface LoanItemCardProps {
  formData: {
    address: string;
    productType: LoanType;
    loanAmount: number;
    applicationTime: Date | string;
    loanStage: LoanStage;
    brokerOriginationFee?: number;
    brokerProcessingFee?: number;
    brokerPoints?: number;
    lenderOriginationFee?: number;
    lenderProcessingFee?: number;
    lenderPoints?: number;
    officerOriginationFee?: number;
    officerProcessingFee?: number;
    officerPoints?: number;
    youlandId: string;
    agentFee?: number;
  };
  userType: UserType | undefined;
  children?: ReactNode;
  onDelete: () => void;
  onView: () => void;
}

export const LoanItemCard: FC<LoanItemCardProps> = ({
  formData,
  userType,
  onView,
  onDelete,
}) => {
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
    lenderOriginationFee,
    lenderProcessingFee,
    lenderPoints,
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

  const handledClick = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setPopperVisible((open) => !open);
  }, []);

  const handledView = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handledClose(e);
      await onView();
    },
    [handledClose, onView],
  );

  const handledDelete = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handledClose(e);
      onDelete();
    },
    [handledClose, onDelete],
  );

  return (
    <Box
      onClick={handledView}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px solid #D2D6E1',
        transition: 'all .3s',
        cursor: 'pointer',
        width: {
          xxl: 'calc(33% - 11.5px)',
          xl: 'calc(32.95% - 11.5px)',
          lg: 'calc(50% - 12px)',
          xs: '100%',
        },
        '&:hover': {
          borderColor: 'primary.main',
        },
        '& .MuiTypography-subtitle1': {
          fontSize: {
            md: 16,
            xs: 12,
          },
        },
      }}
    >
      <Stack
        alignItems={'center'}
        display={'inline-flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Box minWidth={0} width={'calc(100% - 64px)'}>
          {address ? (
            <>
              <Typography
                overflow={'hidden'}
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant={'subtitle1'}
                width={'100%'}
              >
                {line_1}
              </Typography>
              <Typography
                overflow={'hidden'}
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant={'subtitle1'}
                width={'100%'}
              >
                {line_2}
              </Typography>
            </>
          ) : (
            <Typography variant={'subtitle1'}>Draft</Typography>
          )}
        </Box>
        <StyledButton
          color={'info'}
          isIconButton
          onClick={handledClick}
          ref={anchorRef}
          sx={{ flexShrink: 0 }}
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
                    <MenuItem onClick={handledView} sx={{ width: '100%' }}>
                      <Icon
                        className={'POS_mr_3'}
                        component={RemoveRedEyeOutlined}
                      />
                      View
                    </MenuItem>
                    <MenuItem onClick={handledDelete} sx={{ width: '100%' }}>
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
            fontSize: {
              md: 16,
              xs: 12,
            },
            mt: 3,

            '&:first-of-type': {
              mt: 0,
            },
          },
        }}
      >
        <Box className={'product_item'}>
          <Box>Loan type</Box>
          <Typography variant={'subtitle1'}>{productType}</Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Loan amount</Box>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(loanAmount)}
          </Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Application date</Box>
          <Typography variant={'subtitle1'}>
            {format(new Date(applicationTime), 'MM/dd/yyyy')}
          </Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Stage</Box>
          <StyledBadge content={loanStage} status={loanStage} />
        </Box>
        {(userType === UserType.BROKER ||
          userType === UserType.LOAN_OFFICER ||
          userType === UserType.LENDER) && (
          <>
            <Box className={'product_item'}>
              <Box>Origination fee</Box>
              <Typography variant={'subtitle1'}>
                {`${POSFormatDollar(
                  brokerOriginationFee ||
                    officerOriginationFee ||
                    lenderOriginationFee,
                )}(${POSFormatPercent(
                  (brokerPoints && brokerPoints / 100) ||
                    (officerPoints && officerPoints / 100) ||
                    (lenderPoints && lenderPoints / 100) ||
                    undefined,
                )})`}
              </Typography>
            </Box>
            <Box className={'product_item'}>
              <Box>Processing fee</Box>
              <Typography variant={'subtitle1'}>
                {POSFormatDollar(
                  brokerProcessingFee ||
                    officerProcessingFee ||
                    lenderProcessingFee,
                )}
              </Typography>
            </Box>
          </>
        )}

        {userType === UserType.REAL_ESTATE_AGENT && (
          <Box className={'product_item'}>
            <Box>Referral fee</Box>
            <Typography variant={'subtitle1'}>
              {POSFormatDollar(agentFee)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
