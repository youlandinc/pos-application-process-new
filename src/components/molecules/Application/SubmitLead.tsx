import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
} from '@/components/atoms';
import { FC } from 'react';

export const SubmitLead: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
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
          {/*<StyledGoogleAutoComplete*/}
          {/*    address={loanAddress}*/}
          {/*    stateError={stateError}*/}
          {/*/>*/}
        </StyledFormItem>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mx={'auto'}
          width={'100%'}
        >
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
            id={'application-submit-lead-next-button'}
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
