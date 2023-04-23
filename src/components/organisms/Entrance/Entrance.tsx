import { StyledBoxWrap, StyledButton } from '@/components/atoms';
import { UserType } from '@/types';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { useMemo } from 'react';

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
    <StyledBoxWrap sx={{ border: '1px solid' }}>
      {computedArray.map((item, index) => {
        return (
          <StyledButton
            key={item.name + index}
            //onClick={() => (window.location.href = item.url)}
            disabled={item.disabled}
            //onMouseEnter={() => {
            //  setImage(item.image);
            //}}
          >
            {item.name}
          </StyledButton>
        );
      })}
    </StyledBoxWrap>
  );
});
