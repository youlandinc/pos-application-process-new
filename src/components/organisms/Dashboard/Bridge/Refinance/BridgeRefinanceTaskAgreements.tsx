import { FC } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { Box, Stack } from '@mui/material';
import { StyledButton, StyledFormItem } from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const BridgeRefinanceTaskAgreements: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { state } = useSessionStorageState('tenantConfig');
  return (
    <StyledFormItem gap={3} label={'Agreements'}>
      <StyledFormItem
        label={`Review and accept ${
          //sass
          state?.organizationName || ' YouLand'
        }'s construction holdback process`}
        maxWidth={900}
        sub
      >
        <Box className={'link_style'}>View Construction Holdback Process</Box>
      </StyledFormItem>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
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
