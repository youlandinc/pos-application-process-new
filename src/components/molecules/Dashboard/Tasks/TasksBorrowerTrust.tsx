import { Dispatch, SetStateAction } from 'react';
import { Icon, Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_LOAN_ANSWER } from '@/constants';
import { TasksBorrowerSignatories } from './index';

import {
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  StyledTooltip,
} from '@/components/atoms';
import { LoanAnswerEnum } from '@/types';

import ICON_INFO from './assets/icon-info.svg';

interface TasksBorrowerTrustProps {
  formError: Record<string, any> | undefined;
  setFormError: Dispatch<SetStateAction<Record<string, any> | undefined>>;
}

export const TasksBorrowerTrust = observer<TasksBorrowerTrustProps>(
  ({ formError, setFormError }) => {
    const {
      dashboardInfo: { taskBorrower },
    } = useMst();

    return (
      <>
        <StyledFormItem gap={3} label={'Trust information'} sub>
          <StyledTextField
            label={'Trust name'}
            onChange={(e) => {
              if (formError?.trustName) {
                setFormError((prev: any) => {
                  if (prev) {
                    delete prev.trustName;
                  }
                  return prev;
                });
              }
              taskBorrower.changeFieldValue('trustName', e.target.value);
            }}
            placeholder={'Trust name'}
            sx={{ maxWidth: 600 }}
            validate={formError?.trustName}
            value={taskBorrower.trustName}
          />

          <Stack bgcolor={'#D2D6E1'} height={'1px'} maxWidth={600} />

          <Stack maxWidth={600}>
            <StyledGoogleAutoComplete
              address={taskBorrower.addressInfo}
              addressError={formError?.addressInfo || void 0}
              label={'Mailing address'}
            />
          </Stack>
        </StyledFormItem>

        {/* todo: poa*/}
        <StyledFormItem
          gap={3}
          label={
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              Signing & Authorization{' '}
              <StyledTooltip
                mode={'controlled'}
                placement={'right'}
                sx={{ maxWidth: 400 }}
                title={
                  'A POA (Power of Attorney) is a written authorization allowing an agent to sign loan documents on the borrower’s behalf.'
                }
                tooltipSx={{ width: 24, height: 24 }}
              >
                <Stack>
                  <Icon component={ICON_INFO} />
                </Stack>
              </StyledTooltip>
            </Stack>
          }
          labelSx={{ pb: 3 }}
          maxWidth={600}
          sub
          tip={'Most people say no'}
          tipSx={{ textAlign: 'left' }}
        >
          <StyledSelect
            label={'Will you be signing using POA (Power of Attorney)? '}
            onChange={(e) => {
              taskBorrower.changeFieldValue(
                'attorney',
                e.target.value as string as LoanAnswerEnum,
              );
            }}
            options={OPTIONS_COMMON_LOAN_ANSWER}
            sx={{ maxWidth: 600 }}
            value={taskBorrower.attorney}
          />
        </StyledFormItem>

        <TasksBorrowerSignatories />
      </>
    );
  },
);
