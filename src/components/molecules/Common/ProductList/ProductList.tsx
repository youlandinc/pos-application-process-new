import { FC } from 'react';
import { Fade, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { useBreakpoints } from '@/hooks';

import { StyledLoading } from '@/components/atoms';

import {
  ProductCustomItem,
  ProductItem,
  ProductMessageList,
  // ProductNoResultContact,
} from './index';

import { ProductItemProps } from '@/types';

interface ProductListProps {
  errorList: Array<string | any>;
  productList: Array<ProductItemProps | any>;
  loading: boolean;
  totalLoanAmount?: number;
}

export const ProductList: FC<ProductListProps> = observer(
  ({ errorList, productList, loading, totalLoanAmount }) => {
    const breakpoints = useBreakpoints();

    return (
      <>
        {loading ? (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            margin={'auto 0'}
            mt={5}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : (
          <Fade in={!loading}>
            <Stack gap={5} mt={5} width={'100%'}>
              {productList.length > 0 && (
                <Stack alignItems={'center'} width={'100%'}>
                  <Typography
                    color={'text.secondary'}
                    mb={3}
                    variant={
                      ['xs', 'sm', 'md'].includes(breakpoints)
                        ? 'body3'
                        : 'body1'
                    }
                  >
                    The following loan programs are available for you.
                  </Typography>

                  <Stack
                    flexDirection={{ xs: 'column', md: 'row' }}
                    flexWrap={'wrap'}
                    gap={3}
                    width={'100%'}
                  >
                    {productList.map((item, index) => (
                      <ProductItem key={`${item.id}-${index}`} {...item} />
                    ))}
                    <ProductCustomItem totalLoanAmount={totalLoanAmount} />
                  </Stack>

                  <Typography
                    color={'text.secondary'}
                    mt={3}
                    textAlign={'center'}
                    variant={
                      ['xs', 'sm', 'md'].includes(breakpoints)
                        ? 'body3'
                        : 'body1'
                    }
                    width={'100%'}
                  >
                    <b>Disclaimer: </b>The loan products above are suggested
                    based on the information provided so far.
                  </Typography>
                  <Typography
                    color={'text.secondary'}
                    textAlign={'center'}
                    variant={
                      ['xs', 'sm', 'md'].includes(breakpoints)
                        ? 'body3'
                        : 'body1'
                    }
                    width={'100%'}
                  >
                    The exact loan terms will be confirmed later.
                  </Typography>
                </Stack>
              )}

              {errorList.length > 0 && (
                <>
                  <ProductMessageList errorList={errorList} />
                  {/*<ProductNoResultContact />*/}
                  <ProductCustomItem totalLoanAmount={totalLoanAmount} />
                </>
              )}
            </Stack>
          </Fade>
        )}
      </>
    );
  },
);
