import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_LOAN_ANSWER } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
} from '@/components/atoms';
import { Stack } from '@mui/material';

export const BackgroundInformation: FC<FormNodeBaseProps> = observer(
  ({ backStep, backState, nextStep, nextState }) => {
    const {
      applicationForm: { backgroundInformation },
    } = useMst();

    return (
      <StyledFormItem
        label={'Background information'}
        labelSx={{ m: 0 }}
        m={'0 auto'}
        maxWidth={900}
        width={'100%'}
      >
        <StyledFormItem
          label={'Has the borrower had a bankruptcy within the past 24 months?'}
          labelSx={{ textAlign: 'left' }}
          maxWidth={600}
          mt={{ xs: 1, lg: 5 }}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === backgroundInformation.hadBankruptcy) {
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
          labelSx={{ textAlign: 'left' }}
          maxWidth={600}
          mt={{ xs: 3, lg: 7 }}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === backgroundInformation.hadDelinquent) {
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
          labelSx={{ textAlign: 'left' }}
          maxWidth={600}
          mt={{ xs: 3, lg: 7 }}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === backgroundInformation.hadForeclosure) {
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
          labelSx={{ textAlign: 'left' }}
          maxWidth={600}
          mt={{ xs: 3, lg: 7 }}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === backgroundInformation.hadFelony) {
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
          labelSx={{ textAlign: 'left' }}
          maxWidth={600}
          mt={{ xs: 3, lg: 7 }}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === backgroundInformation.hadLitigation) {
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
          mt={{ xs: 3, lg: 10 }}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{
              width: 'calc(50% - 12px)',
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            loading={nextState}
            onClick={nextStep}
            sx={{
              width: 'calc(50% - 12px)',
            }}
          >
            Next
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
