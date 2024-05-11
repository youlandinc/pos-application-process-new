import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';
import { LoanAnswerEnum } from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledTextField,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

export const CompensationInformation: FC<FormNodeBaseProps> = observer(
  ({ nextState, nextStep, backState, backStep }) => {
    const {
      applicationForm: { compensationInformation },
    } = useMst();

    // todo - user type

    //const computedLabel = useMemo(()=>{
    //  swtich(userType){
    //
    //  }
    //},[])

    return (
      <Stack gap={{ xs: 6, lg: 8 }} m={'0 auto'} maxWidth={600} width={'100%'}>
        <StyledFormItem
          gap={3}
          label={'Compensation'}
          labelSx={{ pb: 3 }}
          sub
          tip={'Please list your commission fees below'}
          tipSx={{
            mt: 0.5,
            textAlign: 'left',
            fontSize: { xs: 12, lg: 16 },
          }}
        >
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            ml={-0.5}
            width={'100%'}
          >
            <StyledTextFieldNumber
              decimalScale={3}
              label={'Broker origination fee'}
              onValueChange={({ floatValue }) =>
                compensationInformation.changeFieldValue(
                  'originationPoints',
                  floatValue,
                )
              }
              percentage={true}
              suffix={'%'}
              thousandSeparator={false}
              value={compensationInformation.originationPoints}
            />

            <StyledTextFieldNumber
              label={'Broker processing fee'}
              onValueChange={({ floatValue }) =>
                compensationInformation.changeFieldValue(
                  'processingFee',
                  floatValue,
                )
              }
              prefix={'$'}
              value={compensationInformation.processingFee}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Do you want to provide additional info about this loan?'}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              compensationInformation.changeFieldValue(
                'isAdditional',
                value === LoanAnswerEnum.yes,
              );
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%' }}
            value={
              compensationInformation.isAdditional
                ? LoanAnswerEnum.yes
                : LoanAnswerEnum.no
            }
          />
          <Transitions
            style={{
              display: compensationInformation.isAdditional ? 'flex' : 'none',
              width: '100%',
              maxWidth: 600,
            }}
          >
            {compensationInformation.isAdditional && (
              <StyledTextField
                label={'Additional information'}
                multiline
                onChange={(e) =>
                  compensationInformation.changeFieldValue(
                    'additionalInfo',
                    e.target.value,
                  )
                }
                placeholder={'Additional information'}
                rows={4}
                sx={{ width: '100%' }}
                value={compensationInformation.additionalInfo}
              />
            )}
          </Transitions>
        </StyledFormItem>

        <Stack flexDirection={'row'} gap={3} maxWidth={600} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ flex: 1 }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            loading={nextState}
            onClick={nextStep}
            sx={{ flex: 1 }}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
