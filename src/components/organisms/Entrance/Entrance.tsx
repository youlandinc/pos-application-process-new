import { useMemo } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { EntranceStyles } from './index';
import { UserType } from '@/types';

import {
  StyledBoxWrap,
  StyledButton,
  StyledFormItem,
  StyledHeaderLogo,
} from '@/components/atoms';

const productList = [
  // {
  //   name: 'Mortgage',
  //   url: '/application/mortgage',
  //   disabled: false,
  // },
  //{ name: 'Alternative mortgage', url: '/application/alternative_mortgage' },
  //{ name: 'Rental', url: '/application/rental' },
  {
    name: 'Bridge/Fix and Flip',
    url: '/application/bridge',
    disabled: false,
  },
  //{ name: 'Jumbo', url: '/application/jumbo' },
  //{ name: 'Crypto mortgage', url: '/application/crypto_mortgage' },
  //{ name: 'Crypto loan', url: '/application/crypto_loan' },
];

export const Entrance = observer(() => {
  const { userType } = useMst();

  const computedArray = useMemo(() => {
    if (userType === UserType.BROKER) {
      productList.forEach((item) => {
        if (item.name !== 'Bridge/Fix and Flip') {
          item.disabled = true;
        }
      });
    }
    return productList;
  }, [userType]);

  return (
    <Box>
      <Box sx={EntranceStyles.header}>
        <Box className={'entrance_header_inside'}>
          <StyledHeaderLogo />
        </Box>
      </Box>
      <StyledBoxWrap>
        <StyledFormItem
          className={'POS_tc POS_fullwidth'}
          label={'Which product are you interested in?'}
        >
          {computedArray.map((item, index) => {
            return (
              <StyledButton
                key={item.name + index}
                onClick={() => (window.location.href = item.url)}
                sx={{ width: { md: 600, xs: '100%' } }}
                variant={'outlined'}
              >
                {item.name}
              </StyledButton>
            );
          })}
        </StyledFormItem>
      </StyledBoxWrap>
    </Box>
  );
});
