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
      <StyledFormItem
        label={'Compensation'}
        labelSx={{ m: 0, textAlign: 'left' }}
        m={'0 auto'}
        maxWidth={600}
        tip={'Please list your commission fees below'}
        tipSx={{ m: 0, mt: 1, textAlign: 'left' }}
      >
        <Stack
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={3}
          mt={3}
          width={'100%'}
        >
          <StyledTextFieldNumber
            label={'Broker origination fee'}
            onValueChange={({ floatValue }) =>
              compensationInformation.changeFieldValue(
                'originationPoints',
                floatValue,
              )
            }
            percentage={true}
            suffix={'%'}
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

        <StyledFormItem
          gap={3}
          label={'Do you want to provide additional info about this loan?'}
          labelSx={{ m: 0, textAlign: 'left' }}
          mt={10}
        >
          <StyledButtonGroup
            onChange={(e, value) => {
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
                onChange={(e) =>
                  compensationInformation.changeFieldValue(
                    'additionalInfo',
                    e.target.value,
                  )
                }
                placeholder={'Additional information'}
                sx={{ width: '100%' }}
                value={compensationInformation.additionalInfo}
              />
            )}
          </Transitions>
        </StyledFormItem>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={10}
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
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
          >
            Next
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
