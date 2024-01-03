import { ChangeEvent, FC, useCallback } from 'react';
import { Stack, Typography } from '@mui/material';
import { NumberFormatValues } from 'react-number-format';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState } from '@/hooks';
import { CommonBorrowerType, UserType } from '@/types';
import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';

import {
  HASH_COMMON_PERSON,
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

export const BridgeCoBorrowerInfo: FC = observer(() => {
  const {
    applicationForm: {
      formData: { creditScore },
    },
    userType,
  } = useMst();
  const { saasState } = useSessionStorageState('tenantConfig');

  const coBorrowerInfo: IPersonalInfo = creditScore.coBorrowerInfo;
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
          case 'citizenship': {
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

  return (
    <>
      <StyledFormItem
        alignItems={'center'}
        label={'Would you like to add a co-borrower?'}
        tip={
          <>
            <Typography color={'info.main'} variant={'body1'}>
              This means{' '}
              {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun}{' '}
              and co-borrower&apos;s assets and income will be counted together.
              You can&apos;t remove the co-borrower once you have started your
              application unless you restart.
            </Typography>
            <Typography color={'info.main'} mt={1.5} variant={'body1'}>
              You may skip adding a co-borrower for now and add one later.
            </Typography>
          </>
        }
      >
        <StyledButtonGroup
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
            label={'Tell us about co-borrower'}
            labelSx={{ mb: 0 }}
            tip={
              "We are only collecting co-borrower's information for now. Checking credit score will be done in tasks."
            }
            tipSx={{ mb: 0 }}
          >
            <StyledFormItem
              label={"What is co-borrower's citizenship status?"}
              sub
            >
              <StyledSelectOption
                onChange={changeFieldValue('citizenship')}
                options={OPTIONS_COMMON_CITIZEN_TYPE}
                value={coBorrowerInfo.citizenship}
              />
            </StyledFormItem>
            <StyledFormItem
              label={'Personal information'}
              sub
              tip={`By entering co-borrower's phone number, you are authorizing ${
                //sass
                ' ' + saasState?.organizationName || ' YouLand'
              } to use this number to call, text and send ${
                HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER]
                  .the_third_subject
              } messages by any method. We don't charge for contacting you, but your service provider may.`}
            >
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
                  label={"The co-borrower's social security number"}
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
