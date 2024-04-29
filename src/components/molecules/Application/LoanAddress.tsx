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
      <StyledFormItem
        label={"What's the address of the property?"}
        m={'0 auto'}
        maxWidth={600}
      >
        <StyledGoogleAutoComplete address={loanAddress} />

        <Stack flexDirection={'row'} gap={3} mt={10} width={'100%'}>
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
            disabled={nextState}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'contained'}
          >
            Next
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
