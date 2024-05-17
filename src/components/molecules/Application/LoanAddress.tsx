import { FC, useCallback, useEffect } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
} from '@/components/atoms';

export const LoanAddress: FC<FormNodeBaseProps & { stateError: boolean }> =
  observer(({ nextStep, nextState, backState, backStep, stateError }) => {
    const {
      applicationForm: { loanAddress },
    } = useMst();

    const keydownEvent = useCallback(
      (e: KeyboardEvent) => {
        const button: (HTMLElement & { disabled?: boolean }) | null =
          document.getElementById('application-loan-address-next-button');

        if (!button) {
          return;
        }

        if (e.key === 'Enter') {
          if (!button.disabled) {
            nextStep?.();
          }
        }
      },
      [nextStep],
    );

    useEffect(() => {
      document.addEventListener('keydown', keydownEvent, false);
      return () => {
        document.removeEventListener('keydown', keydownEvent, false);
      };
    }, [keydownEvent]);

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
          <StyledGoogleAutoComplete
            address={loanAddress}
            stateError={stateError}
          />
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
            id={'application-loan-address-next-button'}
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
  });
