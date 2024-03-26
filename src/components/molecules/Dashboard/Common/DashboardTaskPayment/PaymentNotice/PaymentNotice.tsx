import { ChangeEvent, FC } from 'react';
import { Typography } from '@mui/material';

import { StyledCheckbox, StyledFormItem } from '@/components/atoms';

interface ConfirmTableProps {
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
}

export const PaymentNotice: FC<ConfirmTableProps> = (props) => {
  const { onCheckValueChange, check } = props;

  return (
    <StyledFormItem
      alignItems={'center'}
      gap={6}
      label={'Confirm your interest in this loan'}
      px={{ lg: 3, xs: 0 }}
      tip={
        <>
          <Typography color={'info.main'} variant={'body1'}>
            Before making your appraisal payment, please confirm your intention
            to proceed. This step does not bind you legally to accept the loan
            offer—it just lets us know that you understand your loan terms. You
            can still add a co-borrower or adjust your application details later
            if needed.
          </Typography>
        </>
      }
      tipSx={{ m: 0 }}
      width={'100%'}
    >
      <StyledCheckbox
        checked={check}
        label="I intend to proceed with this loan."
        onChange={onCheckValueChange}
      />
    </StyledFormItem>
  );
};
