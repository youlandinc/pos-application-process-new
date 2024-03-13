import { Dispatch, FC, ReactNode, SetStateAction, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { LoanStage, RatesProductData, UserType } from '@/types';

import { StyledLoading } from '@/components/atoms';
import { RatesCustomLoan, RatesItems, RatesSearchNoResult } from './components';
import { observer } from 'mobx-react-lite';
import { CustomRateData } from '@/types/dashboard';
import { User } from '@/types/user';

interface RatesProductListProps {
  productList: RatesProductData[];
  onClick: (item: RatesProductData) => void;
  loading: boolean;
  userType?: UserType;
  loanStage?: LoanStage;
  label?: ReactNode;
  reasonList: string[];
  id?: string;
  customLoan: CustomRateData;
  setCustomLoan: Dispatch<SetStateAction<CustomRateData>>;
  onCustomLoanClick: () => void;
  customLoading: boolean;
  isFirstSearch: boolean;
  productType?: string | 'CUSTOM_LOAN';
  isDashboard?: boolean;
}

export const RatesList: FC<RatesProductListProps> = observer(
  ({
    productList,
    onClick,
    loading,
    userType,
    reasonList,
    id,
    customLoan,
    setCustomLoan,
    onCustomLoanClick,
    customLoading,
    isFirstSearch,
    productType,
    isDashboard = false,
  }) => {
    const breakpoint = useBreakpoints();
    const { saasState } = useSessionStorageState('tenantConfig');

    const condition = useMemo(() => {
      const original = saasState?.posSettings?.customLoanTerms?.reduce(
        (acc: string[], cur: User.POSBorrowerTypes) => {
          if (cur.allowed) {
            acc.push(cur.key);
          }
          return acc;
        },
        [],
      );
      return !(!original?.length || !original.includes(userType));
    }, [saasState?.posSettings?.customLoanTerms, userType]);

    return (
      <Stack id={id} maxWidth={900} mt={!isDashboard ? 2 : 6} width={'100%'}>
        {isFirstSearch ? (
          <></>
        ) : loading ? (
          <StyledLoading
            sx={{ color: 'text.grey', m: '48px auto 48px auto' }}
          />
        ) : reasonList?.length < 1 ? (
          productList.length > 0 ? (
            <Stack alignItems={'center'} gap={3}>
              <Typography color={'text.secondary'} variant={'body1'}>
                The following loan programs are available for you.
              </Typography>
              <Stack
                flexDirection={{ xs: 'column', xl: 'row' }}
                flexWrap={'wrap'}
                gap={3}
                width={'100%'}
              >
                {productList.map((product, index) => {
                  return (
                    <RatesItems
                      breakpoint={breakpoint}
                      key={`${product.id}_${index}`}
                      onClick={onClick}
                      product={product}
                      userType={userType!}
                    />
                  );
                })}
                {condition && (
                  <RatesCustomLoan
                    customLoading={customLoading}
                    customLoan={customLoan}
                    onCustomLoanClick={onCustomLoanClick}
                    productType={productType}
                    setCustomLoan={setCustomLoan}
                    userType={userType!}
                  />
                )}
              </Stack>

              <Stack
                alignItems={'center'}
                justifyContent={'center'}
                mt={3}
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
            <RatesSearchNoResult
              condition={condition}
              customLoading={customLoading}
              customLoan={customLoan}
              onCustomLoanClick={onCustomLoanClick}
              productType={productType}
              setCustomLoan={setCustomLoan}
              userType={userType!}
            />
          )
        ) : (
          <RatesSearchNoResult
            condition={condition}
            customLoading={customLoading}
            customLoan={customLoan}
            onCustomLoanClick={onCustomLoanClick}
            productType={productType}
            reasonList={reasonList}
            setCustomLoan={setCustomLoan}
            userType={userType!}
          />
        )}
      </Stack>
    );
  },
);
