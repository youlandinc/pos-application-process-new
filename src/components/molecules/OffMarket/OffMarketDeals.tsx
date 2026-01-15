import { useState } from 'react';
import Image from 'next/image';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';

import {
  StyledBoxWrap,
  StyledBrand,
  StyledHeaderLogo,
} from '@/components/atoms';

export interface FundedDeal {
  id: number;
  attributes: {
    loanProduct: string;
    loanPurpose: string;
    propertyType: string;
    loanAmount: string;
    loanToValue: string;
    loanTerm: string;
    sqft: string;
    propertyAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }[];
    coverImage: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface FundedDealsResponse {
  data: FundedDeal[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const fetchFundedDeals = async (
  page: number = 1,
  pageSize: number = 100,
): Promise<FundedDealsResponse> => {
  const res = await fetch(
    `https://api.corepass.com/api/off-market-deals?sort[0]=publishedAt:desc&locale=en&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch funded deals: ${res.statusText}`);
  }

  return res.json();
};

export const OffMarketDeals = () => {
  const { loading } = useAsync(async () => {
    const { data } = await fetchFundedDeals(1, 100);
    setList(data);
  }, []);

  const [list, setList] = useState<FundedDeal[]>([]);

  return (
    <>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        height={92}
        m={'0 auto'}
        px={{
          lg: 0,
          xs: 'clamp(24px,6.4vw,80px)',
        }}
        width={{
          xxl: 1440,
          xl: 1240,
          lg: 938,
          xs: '100%',
        }}
      >
        <StyledHeaderLogo />
      </Stack>
      <StyledBoxWrap
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 128px)',
        }}
      >
        <Stack
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={{ xs: 1.5, lg: 7.5, xxl: 15 }}
        >
          <Typography fontSize={'clamp(24px,2.5vw,48px)'} fontWeight={500}>
            Explore YouLand’s Off-Market deals
          </Typography>
          <Stack gap={1}>
            <Typography fontSize={'clamp(14px,1vw,20px)'}>
              As a distinguished member of YouLand Club, you gain exclusive
              access to our Off-Market Deals. These properties are not available
              to the public and are shared only through private channels.
            </Typography>
            <Typography fontSize={'clamp(14px,1vw,20px)'}>
              Members enjoy early access to rare, high-potential investment
              opportunities, gaining an edge before competition intensifies.
            </Typography>
          </Stack>
        </Stack>
        <Stack
          flexDirection={'row'}
          flexWrap={'wrap'}
          gap={{ xs: 3, lg: '60px 120px' }}
          justifyContent={'center'}
          mt={{ xs: 6, lg: 15 }}
          width={'100%'}
        >
          {loading ? (
            <CircularProgress size={48} sx={{ color: '#5B76BC' }} />
          ) : (
            list.map((item, index) => (
              <Stack
                key={`${item.id}-${index}`}
                maxWidth={500}
                width={{ xs: '100%', lg: 'calc(50% - 60px)' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    aspectRatio: '5 / 4',
                  }}
                >
                  <Image
                    alt={''}
                    fill
                    src={item.attributes.coverImage.data.attributes.url}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      borderRadius: 12,
                    }}
                    unoptimized
                  />
                </Box>

                <Stack alignItems={'center'} gap={1} mt={3}>
                  <Typography fontSize={'clamp(24px,2vw,40px)'} lineHeight={1}>
                    {item.attributes.propertyAddress[0].street ||
                      '1444 Dineen Street'}
                  </Typography>
                  <Typography
                    fontSize={'clamp(20px,1.7vw,32px)'}
                    lineHeight={1}
                  >
                    {item.attributes.propertyAddress[0].city},{' '}
                    {item.attributes.propertyAddress[0].state}{' '}
                    {item.attributes.propertyAddress[0].zipCode}
                  </Typography>
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    fontSize={'clamp(14px,1.15vw,22px)'}
                  >
                    {item.attributes.propertyType}{' '}
                    <Box
                      bgcolor={'#B9BCC6'}
                      flexShrink={0}
                      height={'14px'}
                      mx={1.25}
                      width={'1px'}
                    />
                    {item.attributes.sqft || '3,333'}
                    <Box
                      bgcolor={'#B9BCC6'}
                      flexShrink={0}
                      height={'14px'}
                      mx={1.25}
                      width={'1px'}
                    />
                    {item.attributes.loanAmount}
                  </Stack>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </StyledBoxWrap>
      <StyledBrand />
    </>
  );
};
