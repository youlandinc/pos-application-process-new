import { LoanProductCategoryEnum } from '@/types';
import { FC, useCallback, useEffect } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
} from '@/components/atoms';

import ICON_CLOSE from '@/svg/icon/icon_close.svg';

export const LoanAddress: FC<FormNodeBaseProps & { stateError: boolean }> =
  observer(({ nextStep, nextState, backState, backStep, stateError }) => {
    const {
      applicationForm: { loanAddress, productCategory },
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
          tip={
            productCategory === LoanProductCategoryEnum.land ? (
              <Stack alignItems={'flex-start'} justifyItems={'flex-start'}>
                <Typography fontSize={14}>
                  Coastal states: California, Texas, Florida etc.
                </Typography>
                <Typography fontSize={14}>
                  High-growth markets: Across the Sun Belt, where housing demand
                  is strong
                </Typography>
              </Stack>
            ) : null
          }
        >
          <StyledGoogleAutoComplete
            address={loanAddress}
            disabled={!loanAddress.editable}
            stateError={stateError}
          />

          {productCategory !== LoanProductCategoryEnum.land && (
            <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
              <Stack bgcolor={'#D2D6E1'} flex={1} height={2} />
              <StyledButton
                color={'info'}
                disabled={!loanAddress.editable}
                onClick={() => {
                  if (!loanAddress.editable) {
                    return;
                  }
                  loanAddress.addAdditionalAddress();
                }}
                sx={{
                  p: '0 !important',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
                variant={'text'}
              >
                + Add another property
              </StyledButton>
            </Stack>
          )}

          {loanAddress.additionalAddress.length > 0 &&
            loanAddress.additionalAddress.map((item, index) => (
              <Fade in={true} key={item.id}>
                <Stack
                  gap={3}
                  key={`additional-address-${item.id}`}
                  width={'100%'}
                >
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                  >
                    <Typography variant={'subtitle1'}>
                      Additional property {index + 1}
                    </Typography>

                    <Icon
                      component={ICON_CLOSE}
                      onClick={() => loanAddress.removeAdditionalAddress(index)}
                      sx={{
                        height: { xs: 20, lg: 24 },
                        width: { xs: 20, lg: 24 },
                        cursor: 'pointer',
                      }}
                    />
                  </Stack>
                  <StyledGoogleAutoComplete
                    address={item}
                    stateError={stateError}
                  />
                </Stack>
              </Fade>
            ))}
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
