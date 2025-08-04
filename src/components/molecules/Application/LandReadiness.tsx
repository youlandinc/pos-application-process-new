import { useCallback, useEffect } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
} from '@/components/atoms';

export const LandReadiness = observer<FormNodeBaseProps>(
  ({ nextStep, nextState, backState, backStep }) => {
    const {
      applicationForm: { landReadiness },
    } = useMst();

    const keydownEvent = useCallback(
      (e: KeyboardEvent) => {
        const button: (HTMLElement & { disabled?: boolean }) | null =
          document.getElementById('application-land-readiness-next-button');

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
          label={'What’s the intended use of this land?'}
          labelSx={{
            textAlign: { xs: 'left', lg: 'center' },
          }}
          width={'100%'}
        ></StyledFormItem>
        <StyledFormItem
          label={'Has the site obtained approved building permits?'}
          labelSx={{
            textAlign: { xs: 'left', lg: 'center' },
          }}
          width={'100%'}
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              landReadiness.changeFieldValue('hasObtained', value);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={landReadiness.hasObtained}
          />
        </StyledFormItem>
        <StyledFormItem
          label={'Have complete construction documents been prepared?'}
          labelSx={{
            textAlign: { xs: 'left', lg: 'center' },
          }}
          width={'100%'}
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              landReadiness.changeFieldValue('hasCompleted', value);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={landReadiness.hasCompleted}
          />
        </StyledFormItem>
        <StyledFormItem
          label={'Is there a defined development timeline for the project?'}
          labelSx={{
            textAlign: { xs: 'left', lg: 'center' },
          }}
          width={'100%'}
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              landReadiness.changeFieldValue('hasTimeline', value);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={landReadiness.hasTimeline}
          />
        </StyledFormItem>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          mt={-3}
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
            disabled={!!nextState}
            id={'application-land-readiness-next-button'}
            loading={!!nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
