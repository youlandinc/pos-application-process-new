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
import { format, parseISO } from 'date-fns';

import { POSFlex } from '@/styles';
import { LoanSnapshotEnum, PipelineLoanStageEnum, UserType } from '@/types';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
} from '@/utils';

import { StyledBadge, StyledButton } from '@/components/atoms';
import { OPTIONS_LOAN_STAGE } from '@/constants';

export interface LoanItemCardProps {
  formData: {
    loanId: string;
    address: string;
    loanType: string;
    loanAmount: number;
    snapshot: LoanSnapshotEnum;
    applicationDate: Date | null;
    loanStage: PipelineLoanStageEnum;
    originationFee: number | null;
    originationPoints: number | null;
    processingFee: number | null;
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
    loanType,
    loanAmount,
    applicationDate,
    loanStage,
    originationPoints,
    processingFee,
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
      onView();
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
          {line_1 ? (
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
                  <MenuList sx={{ mt: 1.5, width: 180, p: 0 }}>
                    <MenuItem
                      disableRipple
                      onClick={handledView}
                      sx={{
                        width: '100%',
                        p: 3,
                        '&:hover': { bgcolor: 'info.darker' },
                      }}
                    >
                      <Icon
                        className={'POS_mr_3'}
                        component={RemoveRedEyeOutlined}
                      />
                      View
                    </MenuItem>
                    <MenuItem
                      disableRipple
                      onClick={handledDelete}
                      sx={{
                        width: '100%',
                        p: 3,
                        '&:hover': { bgcolor: 'info.darker' },
                      }}
                    >
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
          <Typography variant={'subtitle1'}>{loanType}</Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Loan amount</Box>
          <Typography variant={'subtitle1'}>
            {POSFormatDollar(loanAmount)}
          </Typography>
        </Box>
        <Box className={'product_item'}>
          <Box>Date submitted</Box>
          <Typography variant={'subtitle1'}>
            {format(
              parseISO(applicationDate as unknown as string),
              'MM/dd/yyyy',
            )}
          </Typography>
        </Box>

        {userType !== UserType.CUSTOMER && (
          <Box className={'product_item'}>
            <Box>Compensation</Box>
            <Typography variant={'subtitle1'}>
              {`${
                userType !== UserType.REAL_ESTATE_AGENT
                  ? `${POSFormatPercent(
                      originationPoints || 0,
                      POSGetDecimalPlaces(originationPoints),
                    )} + `
                  : ''
              }${POSFormatDollar(processingFee)}`}
            </Typography>
          </Box>
        )}

        <Box className={'product_item'}>
          <Box>Stage</Box>
          <StyledBadge
            content={POSFindLabel(OPTIONS_LOAN_STAGE, loanStage)}
            status={loanStage}
          />
        </Box>
      </Box>
    </Box>
  );
};
