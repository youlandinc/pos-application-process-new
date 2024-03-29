import { FC, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { RatesProductData, UserType } from '@/types';
import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { StyledButton, StyledTooltip } from '@/components/atoms';

export const RatesItems: FC<{
  product: RatesProductData;
  onClick: (item: RatesProductData) => void;
  userType: UserType;
  breakpoint: string;
}> = ({ product, onClick, userType, breakpoint }) => {
  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
      case UserType.LOAN_OFFICER:
      case UserType.LENDER:
        return (
          <>
            <Stack
              alignItems={'flex-end'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                variant={
                  ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
                }
              >
                Total borrower points
              </Typography>
              <Typography
                variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
              >
                {POSFormatPercent(product.totalBorrowerPoints)}
              </Typography>
            </Stack>
            <Stack
              alignItems={'flex-end'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                variant={
                  ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
                }
              >
                Total origination fee
              </Typography>
              <Typography
                variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
              >
                {POSFormatDollar(product.totalBorrowerFees)}
              </Typography>
            </Stack>
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <Stack
            alignItems={'flex-end'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography
              variant={
                ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
              }
            >
              {POSFormatDollar(product.agentFee)}
            </Typography>
            <Typography
              variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
            >
              Referral fee
            </Typography>
          </Stack>
        );
      default:
        return null;
    }
  }, [
    userType,
    breakpoint,
    product.totalBorrowerPoints,
    product.totalBorrowerFees,
    product.agentFee,
  ]);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Stack
      border={'2px solid #D2D6E1'}
      borderRadius={2}
      gap={3}
      justifyContent={'space-between'}
      minHeight={274}
      p={3}
      sx={{
        transition: 'all .3s',
        '&:hover': { borderColor: 'primary.main' },
      }}
      width={{ xl: 'calc(50% - 12px)', xs: '100%' }}
    >
      <Stack gap={1.5}>
        <Stack
          alignItems={'flex-end'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
            }
          >
            Interest rate
          </Typography>
          <Typography
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint as string) ? 'h7' : 'h5'
            }
          >
            {POSFormatPercent(product.interestRateOfYear)}
          </Typography>
        </Stack>
        <Stack
          alignItems={'flex-end'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
            }
          >
            Loan duration
          </Typography>
          <Typography
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint as string) ? 'h7' : 'h5'
            }
          >
            {product.loanTerm} months
          </Typography>
        </Stack>

        <Stack
          alignItems={'flex-end'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
            }
          >
            Monthly payment
            <StyledTooltip
              title={
                'The current interest calculation is based on dutch basis. However, the actual calculation will be non-dutch based on the actual draw schedule.'
              }
            >
              <InfoOutlined sx={{ width: 16, height: 16 }} />
            </StyledTooltip>
          </Typography>
          <Typography
            component={'div'}
            variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
          >
            {POSFormatDollar(product.paymentOfMonth)}
          </Typography>
        </Stack>

        {renderByUserType}
      </Stack>

      <StyledButton
        onClick={() => onClick(product)}
        onMouseEnter={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          setIsHovering(false);
        }}
        onMouseOver={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        sx={{ height: 56 }}
        variant={!product.selected ? 'contained' : 'outlined'}
      >
        {product.selected
          ? isHovering
            ? 'View details'
            : 'Current rate'
          : 'View details'}
      </StyledButton>
    </Stack>
  );
};
