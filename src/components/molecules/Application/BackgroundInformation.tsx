import { FC, useCallback, useEffect } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_LOAN_ANSWER } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
} from '@/components/atoms';

export const BackgroundInformation: FC<FormNodeBaseProps> = observer(
  ({ backStep, backState, nextStep, nextState }) => {
    const {
      applicationForm: { backgroundInformation },
    } = useMst();

    const keydownEvent = useCallback(
      (e: KeyboardEvent) => {
        const button: (HTMLElement & { disabled?: boolean }) | null =
          document.getElementById(
            'application-background-information-next-button',
          );

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
      <StyledFormItem
        gap={{ xs: 6, lg: 7 }}
        label={'Background information'}
        labelSx={{ pb: 0 }}
        m={'0 auto'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledFormItem
          label={'Has the borrower had a bankruptcy within the past 24 months?'}
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              backgroundInformation.changeFieldValue('hadBankruptcy', value);
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ width: '100%', maxWidth: 600 }}
            value={backgroundInformation.hadBankruptcy}
          />
        </StyledFormItem>

        <StyledFormItem
          label={'Is the borrower delinquent on their mortgage account?'}
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              backgroundInformation.changeFieldValue('hadDelinquent', value);
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ width: '100%', maxWidth: 600 }}
            value={backgroundInformation.hadDelinquent}
          />
        </StyledFormItem>

        <StyledFormItem
          label={
            'Has the borrower had a foreclosure or short sale in the past 7 years?'
          }
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              backgroundInformation.changeFieldValue('hadForeclosure', value);
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ width: '100%', maxWidth: 600 }}
            value={backgroundInformation.hadForeclosure}
          />
        </StyledFormItem>

        <StyledFormItem
          label={
            'Has the borrower been convicted of a felony in the past 7 years?'
          }
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              backgroundInformation.changeFieldValue('hadFelony', value);
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ width: '100%', maxWidth: 600 }}
            value={backgroundInformation.hadFelony}
          />
        </StyledFormItem>

        <StyledFormItem
          label={
            'Has the borrower been involved with any litigation in the past?'
          }
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              backgroundInformation.changeFieldValue('hadLitigation', value);
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ width: '100%', maxWidth: 600 }}
            value={backgroundInformation.hadLitigation}
          />
        </StyledFormItem>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={{ xs: 0, lg: 1 }}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{
              flex: 1,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            id={'application-background-information-next-button'}
            loading={nextState}
            onClick={nextStep}
            sx={{
              flex: 1,
            }}
          >
            Next
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
