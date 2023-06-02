import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { StyledButton, StyledFormItem } from '@/components/atoms';

export const BridgePurchaseTaskCoBorrowerDetails: FC = observer(() => {
  const router = useRouter();

  return (
    <StyledFormItem
      gap={6}
      label={'Co-borrower Details'}
      tip={
        'This means your assets and income will be counted together. You can’t remove your co-borrower once you have started your application unless you restart a new one. '
      }
      tipSx={{ mb: 0 }}
    >
      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() => router.push('/dashboard/tasks')}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
