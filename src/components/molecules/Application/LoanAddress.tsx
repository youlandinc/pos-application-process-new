import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
} from '@/components/atoms';

export const LoanAddress: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
    const {
      applicationForm: { loanAddress },
    } = useMst();

    return (
      <Stack gap={{ xs: 6, lg: 10 }} m={'0 auto'} maxWidth={600} width={'100%'}>
        <StyledFormItem
          gap={3}
          label={"What's the address of the property?"}
          labelSx={{
            pb: 3,
          }}
          maxWidth={600}
        >
          <StyledGoogleAutoComplete address={loanAddress} />
        </StyledFormItem>

        <Stack flexDirection={'row'} gap={3} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState || !loanAddress.checkAddressValid}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'contained'}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
