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
  reasonList: string[];
  id?: string;
}

export const RatesList: FC<RatesProductListProps> = ({
  productList,
  onClick,
  loading,
  isFirstSearch = false,
  userType,
  reasonList,
  id,
}) => {
  const breakpoint = useBreakpoints();
  return (
    <Stack id={id} maxWidth={900} width={'100%'}>
      {isFirstSearch ? (
        <></>
      ) : loading ? (
        <StyledLoading sx={{ color: 'text.grey', m: '48px auto 48px auto' }} />
      ) : reasonList?.length < 1 ? (
        productList.length > 0 ? (
          <Stack
            flexDirection={{ xs: 'column', xl: 'row' }}
            flexWrap={'wrap'}
            gap={3}
            mt={6}
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
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
            >
              <Typography color={'text.secondary'} variant={'body1'}>
                <strong style={{ fontWeight: 600 }}>Disclaimer:</strong> The
                rates above are suggested based on the information provided so
                far.
              </Typography>
              <Typography color={'text.secondary'} variant={'body1'}>
                The exact loan terms will be confirmed later.
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <RatesSearchNoResult />
        )
      ) : (
        <RatesSearchNoResult reasonList={reasonList} />
      )}
    </Stack>
  );
};
