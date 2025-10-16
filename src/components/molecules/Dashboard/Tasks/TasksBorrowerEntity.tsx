import { Dispatch, SetStateAction } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  OPTIONS_COMMON_LOAN_ANSWER,
  OPTIONS_COMMON_STATE,
  OPTIONS_TASK_ENTITY_TYPE,
} from '@/constants';
import { DashboardTaskBorrowerEntityType, LoanAnswerEnum } from '@/types';

import {
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTooltip,
} from '@/components/atoms';
import { TasksBorrowerSignatories } from './index';

import ICON_INFO from './assets/icon-info.svg';

interface TasksBorrowerEntityProps {
  formError: Record<string, any> | undefined;
  setFormError: Dispatch<SetStateAction<Record<string, any> | undefined>>;
}

export const TasksBorrowerEntity = observer<TasksBorrowerEntityProps>(
  ({ formError, setFormError }) => {
    const {
      dashboardInfo: { taskBorrower },
    } = useMst();

    return (
      <>
        <StyledFormItem
          gap={3}
          label={'Entity information'}
          labelSx={{ pb: 3 }}
          maxWidth={600}
          sub
        >
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextField
              label={'Entity name'}
              onChange={(e) => {
                if (formError?.entityName) {
                  setFormError((prev: any) => {
                    if (prev) {
                      delete prev.entityName;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('entityName', e.target.value);
              }}
              placeholder={'Entity name'}
              sx={{ maxWidth: 600 }}
              validate={formError?.entityName}
              value={taskBorrower.entityName}
            />
            <StyledSelect
              label={'Entity type'}
              onChange={(e) => {
                if (formError?.entityType) {
                  setFormError((prev: any) => {
                    if (prev) {
                      delete prev.entityType;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue(
                  'entityType',
                  e.target.value as string as DashboardTaskBorrowerEntityType,
                );
              }}
              options={OPTIONS_TASK_ENTITY_TYPE}
              sx={{ maxWidth: 600 }}
              validate={formError?.entityType}
              value={taskBorrower.entityType}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextFieldPhone
              label={'Company phone'}
              onValueChange={({ value }) => {
                if (formError?.companyPhone) {
                  setFormError((prev: any) => {
                    if (prev) {
                      delete prev.companyPhone;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('phoneNumber', value);
              }}
              placeholder={'Company phone'}
              sx={{ maxWidth: 600 }}
              validate={formError?.companyPhone}
              value={taskBorrower.phoneNumber}
            />
            <StyledTextField
              label={'Company email'}
              onChange={(e) => {
                if (formError?.companyEmail) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.companyEmail;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('email', e.target.value);
              }}
              placeholder={'Company email'}
              sx={{ maxWidth: 600 }}
              validate={formError?.companyEmail}
              value={taskBorrower.email}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextField
              label={'Secretary of State ID'}
              onChange={(e) => {
                if (formError?.entityId) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.entityId;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('entityId', e.target.value);
              }}
              placeholder={'Secretary of State ID'}
              sx={{ maxWidth: 600 }}
              validate={formError?.entityId}
              value={taskBorrower.entityId}
            />
            <StyledSelect
              label={'Formation State'}
              onChange={(e) => {
                if (formError?.entityState) {
                  setFormError((prev: any) => {
                    if (prev) {
                      delete prev.entityState;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue(
                  'entityState',
                  e.target.value as string,
                );
              }}
              options={OPTIONS_COMMON_STATE}
              sx={{ maxWidth: 600 }}
              validate={formError?.entityState}
              value={taskBorrower.entityState}
            />
          </Stack>

          <Stack bgcolor={'#D2D6E1'} height={'1px'} maxWidth={600} />

          <StyledGoogleAutoComplete
            address={taskBorrower.addressInfo}
            addressError={formError?.addressInfo || void 0}
            label={'Mailing address'}
          />
        </StyledFormItem>

        <StyledFormItem
          gap={1}
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
          <Typography color={'text.secondary'} fontSize={12}>
            Most applicants don’t use Power of Attorney
          </Typography>
        </StyledFormItem>

        <TasksBorrowerSignatories />
      </>
    );
  },
);
