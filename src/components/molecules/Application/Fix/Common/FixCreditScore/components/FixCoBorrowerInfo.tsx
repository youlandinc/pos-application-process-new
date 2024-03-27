import { ChangeEvent, FC, useCallback, useEffect } from 'react';
import { Stack } from '@mui/material';
import { NumberFormatValues } from 'react-number-format';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { CommonBorrowerType, DashboardTaskBorrowerType } from '@/types';
import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';

import {
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_YES_OR_NO,
} from '@/constants';

import {
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

export const FixCoBorrowerInfo: FC = observer(() => {
  const {
    applicationForm: {
      formData: { creditScore },
    },
  } = useMst();

  const coBorrowerInfo: IPersonalInfo = creditScore.coBorrowerInfo;
  const selfInfo: IPersonalInfo = creditScore.selfInfo;

  const {
    coBorrowerCondition: { isCoBorrower },
  } = creditScore;

  const changeFieldValue = useCallback(
    (fieldName: keyof SPersonalInfo) =>
      (
        e:
          | ChangeEvent<HTMLInputElement>
          | unknown
          | string
          | NumberFormatValues,
      ) => {
        switch (fieldName) {
          case 'ssn':
            coBorrowerInfo.changeSelfInfo(fieldName, e as unknown as string);
            break;
          case 'phoneNumber':
            coBorrowerInfo.changeSelfInfo(
              fieldName,
              (e as NumberFormatValues).value,
            );
            break;
          case 'dateOfBirth': {
            coBorrowerInfo.changeSelfInfo(fieldName, e as unknown as string);
            break;
          }
          case 'citizenship':
          case 'borrowerType': {
            coBorrowerInfo.changeSelfInfo(fieldName, e as CommonBorrowerType);
            break;
          }
          default:
            coBorrowerInfo.changeSelfInfo(
              fieldName,
              (e as ChangeEvent<HTMLInputElement>).target.value,
            );
            break;
        }
      },
    [coBorrowerInfo],
  );

  useEffect(() => {
    if (selfInfo.borrowerType !== DashboardTaskBorrowerType.individual) {
      creditScore.changeCoBorrowerCondition('isCoBorrower', false);
    }
  }, [creditScore, selfInfo.borrowerType]);

  return (
    <>
      <StyledFormItem
        alignItems={'center'}
        label={'Would you like to add a co-borrower?'}
        tip={
          'Once a co-borrower is added, you cannot remove them without starting over. You can choose to add one later as well.'
        }
      >
        <StyledButtonGroup
          disabled={
            selfInfo.borrowerType !== DashboardTaskBorrowerType.individual
          }
          onChange={(e, value) => {
            if (value !== null) {
              creditScore.changeCoBorrowerCondition(
                'isCoBorrower',
                value === 'yes',
              );
            }
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={isCoBorrower}
        />
      </StyledFormItem>

      <Transitions>
        {isCoBorrower && (
          <StyledFormItem
            gap={6}
            label={'Tell us about the co-borrower'}
            labelSx={{ mb: 0 }}
          >
            <StyledFormItem label={'Personal information'} sub>
              <Stack gap={3} maxWidth={600} width={'100%'}>
                <Stack>
                  <StyledTextField
                    label={'First name'}
                    onChange={changeFieldValue('firstName')}
                    placeholder={'First name'}
                    validate={coBorrowerInfo.errors.firstName}
                    value={coBorrowerInfo.firstName}
                  />
                </Stack>
                <Stack>
                  <StyledTextField
                    label={'Last name'}
                    onChange={changeFieldValue('lastName')}
                    placeholder={'Last name'}
                    validate={coBorrowerInfo.errors.lastName}
                    value={coBorrowerInfo.lastName}
                  />
                </Stack>
                <Stack>
                  <StyledDatePicker
                    label={'Date of birth'}
                    onChange={changeFieldValue('dateOfBirth')}
                    validate={coBorrowerInfo.errors.dateOfBirth}
                    value={coBorrowerInfo.dateOfBirth}
                  />
                </Stack>
                <Stack>
                  <StyledTextFieldPhone
                    label={'Phone number'}
                    onValueChange={changeFieldValue('phoneNumber')}
                    placeholder={'Phone number'}
                    validate={coBorrowerInfo.errors.phoneNumber}
                    value={coBorrowerInfo.phoneNumber}
                  />
                </Stack>
                <Stack>
                  <StyledTextField
                    label={'Email'}
                    onChange={changeFieldValue('email')}
                    placeholder={'Email'}
                    validate={coBorrowerInfo.errors.email}
                    value={coBorrowerInfo.email}
                  />
                </Stack>
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'What is their citizenship status?'} sub>
              <StyledSelectOption
                onChange={changeFieldValue('citizenship')}
                options={OPTIONS_COMMON_CITIZEN_TYPE}
                value={coBorrowerInfo.citizenship}
              />
            </StyledFormItem>

            <StyledFormItem label={'Current address'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledGoogleAutoComplete address={coBorrowerInfo.address} />
              </Stack>
            </StyledFormItem>

            <Transitions
              style={{
                display:
                  coBorrowerInfo.citizenship !==
                  CommonBorrowerType.foreign_national
                    ? 'block'
                    : 'none',
                width: '100%',
              }}
            >
              {coBorrowerInfo.citizenship !==
                CommonBorrowerType.foreign_national && (
                <StyledFormItem
                  label={"Co-borrower's social security number"}
                  sub
                >
                  <Stack gap={3} maxWidth={600} width={'100%'}>
                    <StyledTextFieldSocialNumber
                      onValueChange={changeFieldValue('ssn')}
                      validate={coBorrowerInfo.errors.ssn}
                      value={coBorrowerInfo.ssn}
                    />
                  </Stack>
                </StyledFormItem>
              )}
            </Transitions>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
