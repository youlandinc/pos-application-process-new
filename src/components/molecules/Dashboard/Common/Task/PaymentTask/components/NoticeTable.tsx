import { ChangeEvent, FC, ReactNode } from 'react';
import { Box } from '@mui/material';

import { StyledCheckbox, StyledFormItem } from '@/components/atoms';
import { PaymentTaskBaseComponentProps } from '@/components/molecules';

const useStyle = {
  maxWidth: 600,
  '&.container': {},

  '& .confirmBox': {
    marginTop: 3,
    marginLeft: 0,
    // width: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,.38)',
    cursor: 'pointer',
    userSelect: 'none',
  },
};

interface NoticeTableProps extends PaymentTaskBaseComponentProps {
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanDetail: ReactNode;
  productType?: ProductCategory;
}

export const NoticeTable: FC<NoticeTableProps> = (props) => {
  const {
    check,
    onCheckValueChange,
    productType = 'mortgage',
    loanDetail,
  } = props;

  return (
    <StyledFormItem
      alignItems={'center'}
      label={
        productType === 'mortgage' ? 'Lock your rate' : 'Confirm your rate'
      }
      sx={useStyle}
    >
      <Box mt={3} width={'100%'}>
        {loanDetail}
      </Box>
      <Box className={'confirmBox'}>
        <StyledCheckbox
          checked={check}
          label={`I agree
          to the terms above and would like to ${
            productType === 'mortgage' ? 'lock' : 'confirm'
          } this rate ${
            productType === 'mortgage' ? 'for the next 30 days' : ''
          }.`}
          onChange={onCheckValueChange}
          style={{ marginRight: 1 }}
        />
      </Box>
    </StyledFormItem>
  );
};
