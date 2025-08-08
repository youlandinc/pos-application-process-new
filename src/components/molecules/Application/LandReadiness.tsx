import { useCallback, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSwitch } from '@/hooks';

import {
  APPLICATION_LAND_INTENDED_USE,
  OPTIONS_COMMON_YES_OR_NO,
} from '@/constants';

import { IntendedUseEnum, LoanAnswerEnum } from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDialog,
  StyledFormItem,
  StyledSelectOption,
} from '@/components/atoms';

export const LandReadiness = observer<FormNodeBaseProps>(
  ({ nextStep, nextState, backState, backStep }) => {
    const {
      applicationForm: { landReadiness },
    } = useMst();

    const { visible, open, close } = useSwitch(false);

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
          width={'100%'}
        >
          <StyledSelectOption
            onChange={(value) => {
              landReadiness.changeFieldValue(
                'intendedUse',
                value as string as IntendedUseEnum,
              );
            }}
            options={APPLICATION_LAND_INTENDED_USE}
            value={landReadiness.intendedUse}
          />
        </StyledFormItem>
        <StyledFormItem
          label={'Has the site obtained approved building permits?'}
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
            onClick={() => {
              const condition = [
                landReadiness.hasObtained,
                landReadiness.hasCompleted,
                landReadiness.hasTimeline,
              ].some((value) => value === LoanAnswerEnum.no);

              condition ? open() : nextStep?.();
            }}
            sx={{ width: 'calc(50% - 12px)' }}
          >
            Next
          </StyledButton>
        </Stack>

        <StyledDialog
          content={
            <Box
              component={'ul'}
              py={2.25}
              sx={{
                pl: 2.3,
                listStyle: 'outside',
                color: 'text.secondary',
                fontSize: 14,
              }}
            >
              <Box component={'li'}>Approved building permits</Box>
              <Box component={'li'}>Complete construction documents</Box>
              <Box component={'li'}>Defined development timeline</Box>
            </Box>
          }
          footer={
            <StyledButton onClick={close} size={'small'}>
              Confirm
            </StyledButton>
          }
          header={
            <Typography fontSize={{ xs: 16, lg: 18 }} fontWeight={600}>
              Sorry, we fund sites that demonstrate a clear path to development,
              including:
            </Typography>
          }
          onClose={(e, reason) => {
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              close();
            }
          }}
          open={visible}
        />
      </Stack>
    );
  },
);
