import {
  FC,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useMemo,
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

import { useBreakpoints } from '@/hooks';

import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
  LoanSnapshotEnum,
  PipelineLoanStageEnum,
  UserType,
} from '@/types';
import {
  POSFindHashKey,
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
} from '@/utils';

import { StyledBadge, StyledButton, StyledTooltip } from '@/components/atoms';
import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
  MULTIFAMILY_HASH,
  OPTIONS_LOAN_STAGE,
} from '@/constants';

export interface LoanItemCardProps {
  formData: {
    loanId: string;
    address: string[];
    loanAmount: number;
    snapshot: LoanSnapshotEnum;
    applicationDate: Date | null;
    loanStage: PipelineLoanStageEnum;
    originationFee: number | null;
    originationPoints: number | null;
    processingFee: number | null;
    loanNumber: string | null;
    productCategory: LoanProductCategoryEnum;
    loanPurpose: LoanPurposeEnum;
    propertyType: LoanPropertyTypeEnum;
    propertyUnit: LoanPropertyUnitEnum;
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

  const breakpoints = useBreakpoints();

  const anchorRef = useRef<HTMLButtonElement>(null);

  const {
    address,
    //loanAmount,
    applicationDate,
    loanStage,
    originationPoints,
    processingFee,
    loanNumber,
    productCategory,
    loanPurpose,
    propertyType,
    propertyUnit,
  } = formData;

  const renderAddress = useMemo(() => {
    if (address.length > 1) {
      return (
        <StyledTooltip
          mode={['xs', 'sm', 'md'].includes(breakpoints) ? 'click' : 'hover'}
          title={
            <Stack gap={1}>
              {address.map((item, index) => {
                const [line_1, line_2] = item.split('NEW_LINE');
                return (
                  <Typography key={`${item}-${index}`} variant={'body2'}>
                    {line_1} {line_2}
                  </Typography>
                );
              })}
            </Stack>
          }
        >
          <Typography variant={'subtitle1'} width={'fit-content'}>
            Multiple addresses ({address.length})
          </Typography>
        </StyledTooltip>
      );
    }
    if (address.length === 1 && address[0]) {
      const [line_1, line_2] = address[0].split('NEW_LINE');
      return (
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
            {line_1},
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
      );
    }
    return <Typography variant={'subtitle1'}>Draft</Typography>;
  }, [address]);

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
        <Box
          minWidth={0}
          onClick={(e) => {
            e.stopPropagation();
          }}
          width={'calc(100% - 64px)'}
        >
          {renderAddress}
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
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 1.5,
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
        <Stack className={'product_item'}>
          <Box flexShrink={0}>Loan type</Box>
          <Typography textAlign={'right'} variant={'subtitle1'}>
            {`${POSFindLabel(
              APPLICATION_LOAN_CATEGORY,
              productCategory,
            )} ${POSFindLabel(APPLICATION_LOAN_PURPOSE, loanPurpose)}`}
          </Typography>
        </Stack>

        {/*<Box className={'product_item'}>*/}
        {/*  <Box>Loan amount</Box>*/}
        {/*  <Typography variant={'subtitle1'}>*/}
        {/*    {POSFormatDollar(loanAmount)}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}

        <Stack className={'product_item'}>
          <Box flexShrink={0}>Property type</Box>
          <Typography variant={'subtitle1'}>
            {(() => {
              switch (propertyType) {
                case LoanPropertyTypeEnum.two_to_four_family:
                  return `${POSFindLabel(
                    APPLICATION_PROPERTY_UNIT,
                    propertyUnit,
                  )}`;
                case LoanPropertyTypeEnum.multifamily:
                  return `Multifamily (${propertyUnit === LoanPropertyUnitEnum.twenty_plus_units ? '20+' : POSFindHashKey(propertyUnit, MULTIFAMILY_HASH)} Units)`;
                default:
                  return `${POSFindLabel(
                    APPLICATION_PROPERTY_TYPE,
                    propertyType,
                  )}`;
              }
            })()}
          </Typography>
        </Stack>

        <Stack className={'product_item'}>
          <Box flexShrink={0}>Date submitted</Box>
          <Typography variant={'subtitle1'}>
            {format(
              parseISO(applicationDate as unknown as string),
              'MM/dd/yyyy',
            )}
          </Typography>
        </Stack>

        {userType !== UserType.CUSTOMER && (
          <Stack className={'product_item'}>
            <Box flexShrink={0}>Compensation</Box>
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
          </Stack>
        )}

        <Stack className={'product_item'}>
          <Box flexShrink={0}>Stage</Box>
          <StyledBadge
            content={POSFindLabel(OPTIONS_LOAN_STAGE, loanStage)}
            status={loanStage}
          />
        </Stack>

        <Stack className={'product_item'}>
          <Box flexShrink={0}>Loan number</Box>
          <Typography variant={'subtitle1'}>{loanNumber}</Typography>
        </Stack>
      </Box>
    </Box>
  );
};
