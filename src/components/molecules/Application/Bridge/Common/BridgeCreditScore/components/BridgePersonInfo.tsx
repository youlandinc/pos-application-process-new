import { ChangeEvent, FC, useCallback } from 'react';
import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';

import {
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
} from '@/components/atoms';
import { NumberFormatValues } from 'react-number-format';
import { useSessionStorageState } from '@/hooks';

// todo : saas
export const BridgePersonInfo: FC = observer(() => {
  const {
    applicationForm: {
      formData: { creditScore },
    },
    // userType,
  } = useMst();
  const { saasState } = useSessionStorageState('tenantConfig');

  const selfInfo: IPersonalInfo = creditScore.selfInfo;

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
            selfInfo.changeSelfInfo(fieldName, e as unknown as string);
            break;
          case 'phoneNumber':
            selfInfo.changeSelfInfo(fieldName, (e as NumberFormatValues).value);
            break;
          case 'dateOfBirth': {
            selfInfo.changeSelfInfo(fieldName, e as unknown as string);
            break;
          }
          default:
            selfInfo.changeSelfInfo(
              fieldName,
              (e as ChangeEvent<HTMLInputElement>).target.value,
            );
            break;
        }
      },
    [selfInfo],
  );

  return (
    <>
      <StyledFormItem
        gap={6}
        label={'Tell us about yourself'}
        labelSx={{ mb: 0 }}
        tip={
          'We will use this information to review your credit score and history so that we can provide you with real, accurate loan options.'
        }
        tipSx={{ mb: 0 }}
      >
        <StyledFormItem
          label={'Personal Information'}
          sub
          tip={`By entering your phone number,  you're authorizing ${
            //sass
            ' ' + saasState?.organizationName || ' YouLand'
          } to use this number to call, text and send you messages by any method. We don't charge for contacting you, but your service provider may.`}
        >
          <Stack gap={3} maxWidth={600} width={'100%'}>
            <Stack>
              <StyledTextField
                label={'First Name'}
                onChange={changeFieldValue('firstName')}
                placeholder={'First Name'}
                validate={selfInfo.errors.firstName}
                value={selfInfo.firstName}
              />
            </Stack>
            <Stack>
              <StyledTextField
                label={'Last Name'}
                onChange={changeFieldValue('lastName')}
                placeholder={'Last Name'}
                validate={selfInfo.errors.lastName}
                value={selfInfo.lastName}
              />
            </Stack>
            <Stack>
              <StyledDatePicker
                label={'Date of Birth'}
                onChange={changeFieldValue('dateOfBirth')}
                validate={selfInfo.errors.dateOfBirth}
                value={selfInfo.dateOfBirth}
              />
            </Stack>
            <Stack>
              <StyledTextFieldPhone
                label={'Phone Number'}
                onValueChange={changeFieldValue('phoneNumber')}
                placeholder={'Phone Number'}
                validate={selfInfo.errors.phoneNumber}
                value={selfInfo.phoneNumber}
              />
            </Stack>
            <Stack>
              <StyledTextField
                label={'Email'}
                onChange={changeFieldValue('email')}
                placeholder={'Email'}
                validate={selfInfo.errors.email}
                value={selfInfo.email}
              />
            </Stack>
          </Stack>
        </StyledFormItem>
        <StyledFormItem label={'Current Address'} sub>
          <Stack gap={3} maxWidth={600} width={'100%'}>
            <StyledGoogleAutoComplete address={selfInfo.address} />
          </Stack>
        </StyledFormItem>
        <StyledFormItem label={'Your Social Security Number'} sub>
          <Stack gap={3} maxWidth={600} width={'100%'}>
            <StyledTextFieldSocialNumber
              onValueChange={changeFieldValue('ssn')}
              validate={selfInfo.errors.ssn}
              value={selfInfo.ssn}
            />
          </Stack>
        </StyledFormItem>
        <StyledCheckbox
          checked={selfInfo.authorizedCreditCheck}
          label={
            <Typography
              color={'text.primary'}
              component={'div'}
              ml={2}
              variant={'body2'}
            >
              I, {selfInfo.firstName || 'borrower'}{' '}
              {selfInfo.lastName || 'name'} , authorize{' '}
              {
                //sass
                ' ' + saasState?.organizationName || ' YouLand'
              }{' '}
              to verify my credit. I&apos;ve also read and agreed to
              {
                //sass
                ' ' + saasState?.organizationName || ' YouLand'
              }
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
            selfInfo.changeSelfInfo('authorizedCreditCheck', e.target.checked)
          }
          sx={{ maxWidth: 600 }}
        />
      </StyledFormItem>
    </>
  );
});
