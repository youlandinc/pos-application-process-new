import { FC, ReactNode, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { useBreakpoints } from '@/hooks';
import { LoanStage, RatesProductData, UserType } from '@/types';

import { StyledButton, StyledLoading } from '@/components/atoms';

interface RatesProductListProps {
  productList: RatesProductData[];
  onClick: (item: RatesProductData) => void;
  loading: boolean;
  isFirstSearch?: boolean;
  userType?: UserType;
  loanStage?: LoanStage;
  label?: ReactNode;
}

export const BridgeRatesList: FC<RatesProductListProps> = ({
  productList,
  onClick,
  loading,
  isFirstSearch = false,
  userType,
  label,
}) => {
  const breakpoint = useBreakpoints();
  return (
    <Stack maxWidth={900} width={'100%'}>
      {isFirstSearch ? (
        <></>
      ) : loading ? (
        <StyledLoading sx={{ color: 'primary.main' }} />
      ) : (
        <>
          {label ? (
            label
          ) : (
            <Typography
              color={'info.main'}
              mt={3}
              textAlign={'center'}
              variant={
                ['xs', 'sm', 'md'].includes(breakpoint) ? 'body3' : 'body1'
              }
            >
              The following loan programs are available for you
            </Typography>
          )}

          <Stack
            flexDirection={{ xs: 'column', xl: 'row' }}
            flexWrap={'wrap'}
            gap={3}
            mt={3}
            width={'100%'}
          >
            {productList.map((product, index) => (
              <ProductCard
                breakpoint={breakpoint}
                key={`${product.id}_${index}`}
                onClick={onClick}
                product={product}
                userType={userType!}
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
};

const ProductCard: FC<{
  product: RatesProductData;
  onClick: (item: RatesProductData) => void;
  userType: UserType;
  breakpoint: string;
}> = ({ product, onClick, userType, breakpoint }) => {
  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
      case UserType.LOAN_OFFICER:
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
                Total Borrower Points
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
                Total Borrower Fee
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
              Referral Fee
            </Typography>
            <Typography
              variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
            >
              {POSFormatDollar(product.agentFee)}
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

  return (
    <Stack
      border={'2px solid #D2D6E1'}
      borderRadius={2}
      gap={3}
      p={3}
      sx={{
        transition: 'all .3s',
        '&:hover': { borderColor: '#1134E3' },
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
            Loan Term
          </Typography>
          <Typography
            variant={
              ['xs', 'sm', 'md'].includes(breakpoint as string) ? 'h7' : 'h5'
            }
          >
            {product.loanTerm} Months
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
            Rate
          </Typography>
          <Typography
            variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
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
            Monthly Payment
          </Typography>
          <Typography
            variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h5'}
          >
            {POSFormatDollar(product.paymentOfMonth)}
          </Typography>
        </Stack>

        {renderByUserType}
      </Stack>

      <StyledButton
        onClick={() => onClick(product)}
        variant={product.selected ? 'contained' : 'outlined'}
      >
        {product.selected ? 'See Cost' : 'Select'}
      </StyledButton>
    </Stack>
  );
};
