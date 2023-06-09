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
      tip={
        <>
          <Typography color={'info.main'} variant={'body1'}>
            We&apos;re just about ready to move to the next step in the
            application process but first we need to take care of one legal
            detail.
          </Typography>
          <Typography color={'info.main'} mt={1.5} variant={'body1'}>
            According to federal regulations, all lenders are required to go
            through a step called Intent to Proceed. It can sound like a big
            commitment but don&apos;t worry - this isn&apos;t legally-binding
            and if something comes up, you can still back out down the road.
            This just lets us know that you understand your loan terms.
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
