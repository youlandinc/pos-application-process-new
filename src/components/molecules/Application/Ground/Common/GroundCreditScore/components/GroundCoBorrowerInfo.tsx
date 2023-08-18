import { POSFindLabel } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { ChangeEvent, FC, useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  HASH_COMMON_PERSON,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_USER_TYPE,
  OPTIONS_COMMON_YES_OR_NO,
} from '@/constants';
import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';
import { CommonBorrowerType, UserType } from '@/types';

import {
  StyledButtonGroup,
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';
import { NumberFormatValues } from 'react-number-format';
import { useSessionStorageState } from '@/hooks';

export const GroundCoBorrowerInfo: FC = observer(() => {
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
        label={`Would you like to add a Co-borrower to ${
          userType === UserType.CUSTOMER ? 'your' : ''
        } loan?`}
        tip={
          <>
            <Typography color={'info.main'} variant={'body1'}>
              This means{' '}
              {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun}{' '}
              and co-borrower&apos;s assets and income will be counted together.
              You can&apos;t remove co-borrower once you have started your
              application unless you restart a new one.
            </Typography>
            <Typography color={'info.main'} mt={1.5} variant={'body1'}>
              You may skip adding a co-borrower for now and add one later during
              the task.
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
            label={'Tell us about Co-borrower'}
            labelSx={{ mb: 0 }}
            tip={
              "We are only collecting Co-borrower's information for now. Checking credit score will be done in tasks."
            }
            tipSx={{ mb: 0 }}
          >
            <StyledFormItem
              label={"What is Co-borrower's citizenship status?"}
              sub
            >
              <StyledSelectOption
                onChange={changeFieldValue('citizenship')}
                options={OPTIONS_COMMON_CITIZEN_TYPE}
                value={coBorrowerInfo.citizenship}
              />
            </StyledFormItem>
            <StyledFormItem
              label={'Personal Information'}
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
                    label={'First Name'}
                    onChange={changeFieldValue('firstName')}
                    placeholder={'First Name'}
                    validate={coBorrowerInfo.errors.firstName}
                    value={coBorrowerInfo.firstName}
                  />
                </Stack>
                <Stack>
                  <StyledTextField
                    label={'Last Name'}
                    onChange={changeFieldValue('lastName')}
                    placeholder={'Last Name'}
                    validate={coBorrowerInfo.errors.lastName}
                    value={coBorrowerInfo.lastName}
                  />
                </Stack>
                <Stack>
                  <StyledDatePicker
                    label={'Date of Birth'}
                    onChange={changeFieldValue('dateOfBirth')}
                    validate={coBorrowerInfo.errors.dateOfBirth}
                    value={coBorrowerInfo.dateOfBirth}
                  />
                </Stack>
                <Stack>
                  <StyledTextFieldPhone
                    label={'Phone Number'}
                    onValueChange={changeFieldValue('phoneNumber')}
                    placeholder={'Phone Number'}
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
            <StyledFormItem label={'Current Address'} sub>
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
                  label={"The Co-borrower's Social Security Number"}
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
            <StyledCheckbox
              checked={coBorrowerInfo.authorizedCreditCheck}
              label={
                <Typography
                  color={'text.primary'}
                  component={'div'}
                  ml={2}
                  variant={'body2'}
                >
                  I,{' '}
                  {userType === UserType.CUSTOMER
                    ? `${coBorrowerInfo.firstName || 'borrower'}
              ${coBorrowerInfo.lastName || 'name'} , authorize `
                    : `the ${POSFindLabel(
                        OPTIONS_COMMON_USER_TYPE,
                        userType as UserType,
                      ).toLowerCase()} , authorize `}
                  {
                    //sass
                    ' ' + saasState?.organizationName || ' YouLand'
                  }{' '}
                  to verify co-borrower&apos;s credit. I&apos;ve also read and
                  agreed to
                  {
                    //sass
                    ' ' + saasState?.organizationName || ' YouLand'
                  }{' '}
                  &apos;s{' '}
                  <Typography
                    className={'link_style'}
                    component={'span'}
                    onClick={() =>
                      window.open('https://www.youland.com/legal/terms/')
                    }
                  >
                    Terms of Use
                  </Typography>
                  ,{' '}
                  <Typography
                    className={'link_style'}
                    component={'span'}
                    onClick={() =>
                      window.open('https://www.youland.com/legal/privacy/')
                    }
                  >
                    Privacy Policy
                  </Typography>{' '}
                  and consent to{' '}
                  <Typography
                    className={'link_style'}
                    component={'span'}
                    onClick={() =>
                      window.open('https://www.youland.com/legal/e-loan-doc/')
                    }
                  >
                    Receive Electronic Loan Documents
                  </Typography>
                  .
                </Typography>
              }
              onChange={(e) =>
                coBorrowerInfo.changeSelfInfo(
                  'authorizedCreditCheck',
                  e.target.checked,
                )
              }
              sx={{ maxWidth: 600 }}
            />
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});