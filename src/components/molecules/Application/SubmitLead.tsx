import { FC, useCallback, useState } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SubmitLeadSchema } from '@/constants';
import validate from '@/constants/validate';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

const INITIAL_ERROR = {
  firstName: undefined,
  lastName: undefined,
  phoneNumber: undefined,
  email: undefined,
};

export const SubmitLead: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
    const {
      applicationForm: { submitLead },
    } = useMst();

    const [error, setError] = useState(INITIAL_ERROR);

    const onClickToSubmit = useCallback(() => {
      const { firstName, lastName, phoneNumber, email } =
        submitLead.getPostData();

      const target = { firstName, lastName, phoneNumber, email };

      const error = validate(target, SubmitLeadSchema);

      if (error) {
        setError(error);
        return;
      }

      setError(INITIAL_ERROR);

      nextStep?.();
    }, [nextStep, submitLead]);

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
          <StyledGoogleAutoComplete address={submitLead.addressInfo} />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={"What's your contact info?"}
          maxWidth={600}
          pb={3}
        >
          <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
            <StyledTextField
              label={'First name'}
              onChange={(e) =>
                submitLead.changeFieldValue('firstName', e.target.value)
              }
              placeholder={'First name'}
              validate={error.firstName}
              value={submitLead.firstName}
            />
            <StyledTextField
              label={'Last name'}
              onChange={(e) =>
                submitLead.changeFieldValue('lastName', e.target.value)
              }
              placeholder={'Last name'}
              validate={error.lastName}
              value={submitLead.lastName}
            />
          </Stack>
          <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
            <StyledTextFieldPhone
              label={'Phone number'}
              onValueChange={({ value }) => {
                submitLead.changeFieldValue('phoneNumber', value);
              }}
              placeholder={'Phone number'}
              validate={error.phoneNumber}
              value={submitLead.phoneNumber}
            />
            <StyledTextField
              label={'Email'}
              onChange={(e) =>
                submitLead.changeFieldValue('email', e.target.value)
              }
              placeholder={'Email'}
              validate={error.email}
              value={submitLead.email}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Please enter the loan details below'}
          maxWidth={600}
          pb={3}
        >
          <StyledTextField
            inputProps={{
              maxLength: 300,
            }}
            label={'Loan details'}
            multiline
            onChange={(e) =>
              submitLead.changeFieldValue('additionalInfo', e.target.value)
            }
            placeholder={'Any information regarding the property or the loan'}
            rows={4}
            sx={{ width: '100%' }}
            value={submitLead.additionalInfo}
          />
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
            disabled={nextState || submitLead.isEmpty()}
            id={'application-submit-lead-next-button'}
            loading={nextState}
            onClick={onClickToSubmit}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'contained'}
          >
            Submit
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
