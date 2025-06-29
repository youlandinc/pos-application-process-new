import { Dispatch, FC, SetStateAction } from 'react';
import { Stack } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_CITIZEN_TYPE } from '@/constants';
import { LoanCitizenshipEnum } from '@/types';

import {
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

interface TasksBorrowerIndividualProps {
  formError: Record<string, any> | undefined;
  setFormError: Dispatch<SetStateAction<Record<string, any> | undefined>>;
}

export const TasksBorrowerIndividual: FC<TasksBorrowerIndividualProps> =
  observer(({ formError, setFormError }) => {
    const {
      dashboardInfo: { taskBorrower },
    } = useMst();

    return (
      <>
        <StyledFormItem
          gap={3}
          label={'Personal information'}
          labelSx={{ pb: 3 }}
          sub
        >
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextField
              label={'First name'}
              onChange={(e) => {
                if (formError?.firstName) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.firstName;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('firstName', e.target.value);
              }}
              placeholder={'First name'}
              validate={formError?.firstName}
              value={taskBorrower.firstName}
            />
            <StyledTextField
              label={'Last name'}
              onChange={(e) => {
                if (formError?.lastName) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.lastName;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('lastName', e.target.value);
              }}
              placeholder={'Last name'}
              validate={formError?.lastName}
              value={taskBorrower.lastName}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledDatePicker
              disableFuture={true}
              label={'Date of birth'}
              onChange={(value) => {
                if (formError?.birthDate) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.birthDate;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue(
                  'birthDate',
                  isValid(value) && isDate(value)
                    ? format(value as Date, 'yyyy-MM-dd')
                    : null,
                );
              }}
              validate={formError?.birthDate}
              value={new Date(taskBorrower.birthDate || '')}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextFieldPhone
              label={'Phone number'}
              onValueChange={({ value }) => {
                if (formError?.phoneNumber) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.phoneNumber;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('phoneNumber', value);
              }}
              placeholder={'Phone number'}
              validate={formError?.phoneNumber}
              value={taskBorrower.phoneNumber}
            />
            <StyledTextField
              label={'Email'}
              onChange={(e) => {
                if (formError?.email) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.email;
                    }
                    return prev;
                  });
                }
                taskBorrower.changeFieldValue('email', e.target.value);
              }}
              placeholder={'Email'}
              validate={formError?.email}
              value={taskBorrower.email}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Current address'}
          labelSx={{ pb: 3 }}
          maxWidth={600}
          sub
        >
          <StyledGoogleAutoComplete
            address={taskBorrower.addressInfo}
            addressError={formError?.addressInfo || void 0}
          />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Citizenship status'}
          labelSx={{ pb: 3 }}
          maxWidth={600}
          sub
        >
          <StyledSelect
            onChange={(e) => {
              taskBorrower.changeFieldValue(
                'citizenship',
                e.target.value as string as LoanCitizenshipEnum,
              );
            }}
            options={OPTIONS_COMMON_CITIZEN_TYPE}
            sx={{ maxWidth: 600 }}
            value={taskBorrower.citizenship}
          />

          <Transitions
            style={{
              display:
                taskBorrower.citizenship !==
                LoanCitizenshipEnum.foreign_national
                  ? 'flex'
                  : 'none',
              width: '100%',
            }}
          >
            {taskBorrower.citizenship !==
              LoanCitizenshipEnum.foreign_national && (
              <StyledTextFieldSocialNumber
                label={'Social security number'}
                onValueChange={(v) => {
                  if (formError?.ssn) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.ssn;
                      }
                      return prev;
                    });
                  }
                  taskBorrower.changeFieldValue('ssn', v);
                }}
                sx={{ maxWidth: 600 }}
                validate={formError?.ssn}
                value={taskBorrower.ssn}
              />
            )}
          </Transitions>
        </StyledFormItem>
      </>
    );
  });
