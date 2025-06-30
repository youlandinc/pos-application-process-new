import { Dispatch, FC, SetStateAction } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_STATE, OPTIONS_TASK_ENTITY_TYPE } from '@/constants';
import { DashboardTaskBorrowerEntityType } from '@/types';

import {
  StyledFormItem,
  StyledSelect,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import { TasksBorrowerSignatories } from './index';

interface TasksBorrowerEntityProps {
  formError: Record<string, any> | undefined;
  setFormError: Dispatch<SetStateAction<Record<string, any> | undefined>>;
}

export const TasksBorrowerEntity: FC<TasksBorrowerEntityProps> = observer(
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
                  setFormError((prev) => {
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
                  setFormError((prev) => {
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
                  setFormError((prev) => {
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
                  setFormError((prev) => {
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
        </StyledFormItem>

        <TasksBorrowerSignatories />
      </>
    );
  },
);
