import { FC, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { useBreakpoints } from '@/hooks';
import { LoanStage, RatesProductData, UserType } from '@/types';

import { StyledLoading } from '@/components/atoms';
import { RatesItems, RatesSearchNoResult } from './components';

interface RatesProductListProps {
  productList: RatesProductData[];
  onClick: (item: RatesProductData) => void;
  loading: boolean;
  isFirstSearch?: boolean;
  userType?: UserType;
  loanStage?: LoanStage;
  label?: ReactNode;
}

export const RatesList: FC<RatesProductListProps> = ({
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
        <StyledLoading sx={{ color: 'text.grey', m: '48px auto 48px auto' }} />
      ) : productList.length > 0 ? (
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
              <RatesItems
                breakpoint={breakpoint}
                key={`${product.id}_${index}`}
                onClick={onClick}
                product={product}
                userType={userType!}
              />
            ))}
          </Stack>
        </>
      ) : (
        <RatesSearchNoResult />
      )}
    </Stack>
  );
};
