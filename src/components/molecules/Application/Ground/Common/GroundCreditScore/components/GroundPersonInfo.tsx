import { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { NumberFormatValues } from 'react-number-format';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState } from '@/hooks';
import { POSFindLabel, POSFormatUrl, POSUpperFirstLetter } from '@/utils';
import {
  CommonBorrowerType,
  SoftCreditRequirementEnum,
  UserType,
} from '@/types';
import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';

import {
  HASH_COMMON_PERSON,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_USER_TYPE,
} from '@/constants';

import {
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldNumber,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

export const GroundPersonInfo: FC = observer(() => {
  const {
    applicationForm: {
      formData: { creditScore },
    },
    userType,
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
          case 'citizenship': {
            selfInfo.changeSelfInfo(fieldName, e as CommonBorrowerType);
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

  const authorizeContent = useMemo(() => {
    if (selfInfo.citizenship === CommonBorrowerType.foreign_national) {
      return (
        <>
          I&apos;ve also read and agreed to{' '}
          {
            //sass
            ' ' + saasState?.organizationName || ' YouLand'
          }
          &apos;s{' '}
          <Typography
            component={'span'}
            onClick={() =>
              window.open(
                POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                  'https://www.youland.com/legal/terms/',
              )
            }
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Terms of Use
          </Typography>
          ,{' '}
          <Typography
            component={'span'}
            onClick={() =>
              window.open(
                POSFormatUrl(saasState?.legalAgreements?.privacyPolicyUrl) ||
                  'https://www.youland.com/legal/privacy/',
              )
            }
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </Typography>{' '}
          and{' '}
          <Typography
            component={'span'}
            onClick={() =>
              window.open(
                POSFormatUrl(saasState?.legalAgreements?.signaturesUrl) ||
                  'https://www.youland.com/legal/e-loan-doc/',
              )
            }
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            consent to Receive Electronic Loan Documents
          </Typography>
          .
        </>
      );
    }
    return (
      <>
        I,{' '}
        {userType === UserType.CUSTOMER
          ? `${selfInfo.firstName || 'borrower'}
              ${selfInfo.lastName || 'name'}, authorize `
          : `the ${POSFindLabel(
              OPTIONS_COMMON_USER_TYPE,
              userType as UserType,
            ).toLowerCase()}, authorize `}
        {
          //sass
          ' ' + saasState?.organizationName || ' YouLand'
        }{' '}
        to verify{' '}
        {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_oneself} credit.
        I have also read and agreed to
        {
          //sass
          ' ' + saasState?.organizationName || ' YouLand'
        }
        &apos;s{' '}
        <Typography
          component={'span'}
          onClick={() =>
            window.open(
              POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                'https://www.youland.com/legal/terms/',
            )
          }
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Terms of Use
        </Typography>
        ,{' '}
        <Typography
          component={'span'}
          onClick={() =>
            window.open(
              POSFormatUrl(saasState?.legalAgreements?.privacyPolicyUrl) ||
                'https://www.youland.com/legal/privacy/',
            )
          }
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Privacy Policy
        </Typography>{' '}
        and{' '}
        <Typography
          component={'span'}
          onClick={() =>
            window.open(
              POSFormatUrl(saasState?.legalAgreements?.signaturesUrl) ||
                'https://www.youland.com/legal/e-loan-doc/',
            )
          }
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          consent to Receive Electronic Loan Documents
        </Typography>
        .
      </>
    );
  }, [
    saasState?.legalAgreements?.privacyPolicyUrl,
    saasState?.legalAgreements?.signaturesUrl,
    saasState?.legalAgreements?.termsUrl,
    saasState?.organizationName,
    selfInfo.citizenship,
    selfInfo.firstName,
    selfInfo.lastName,
    userType,
  ]);

  return (
    <>
      <StyledFormItem
        gap={6}
        label={`Tell us about ${
          HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_third_subject
        }`}
        labelSx={{ mb: 0 }}
        tip={`We will use this information to review ${
          HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
        } credit score and history so that we can provide you with real, accurate loan options.`}
        tipSx={{ mb: 0 }}
      >
        <StyledFormItem
          label={`What is ${
            HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
          } citizenship status?`}
          sub
        >
          <StyledSelectOption
            onChange={changeFieldValue('citizenship')}
            options={OPTIONS_COMMON_CITIZEN_TYPE}
            value={selfInfo.citizenship}
          />
        </StyledFormItem>
        <StyledFormItem
          label={'Personal information'}
          sub
          tip={`By entering ${
            HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
          } phone number,  you are authorizing ${
            ' ' + saasState?.organizationName || ' YouLand'
          } to use this number to call, text and send ${
            HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].subject
          } messages by any method. We don't charge for contacting ${
            userType === UserType.BROKER ? 'them' : 'you'
          }, but ${
            HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].third_pronoun
          } service provider may.`}
        >
          <Stack gap={3} maxWidth={600} width={'100%'}>
            <Stack>
              <StyledTextField
                label={'First name'}
                onChange={changeFieldValue('firstName')}
                placeholder={'First name'}
                validate={selfInfo.errors.firstName}
                value={selfInfo.firstName}
              />
            </Stack>
            <Stack>
              <StyledTextField
                label={'Last name'}
                onChange={changeFieldValue('lastName')}
                placeholder={'Last name'}
                validate={selfInfo.errors.lastName}
                value={selfInfo.lastName}
              />
            </Stack>
            <Stack>
              <StyledDatePicker
                label={'Date of birth'}
                onChange={changeFieldValue('dateOfBirth')}
                validate={selfInfo.errors.dateOfBirth}
                value={selfInfo.dateOfBirth}
              />
            </Stack>
            <Stack>
              <StyledTextFieldPhone
                label={'Phone number'}
                onValueChange={changeFieldValue('phoneNumber')}
                placeholder={'Phone number'}
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
        <StyledFormItem label={'Current address'} sub>
          <Stack gap={3} maxWidth={600} width={'100%'}>
            <StyledGoogleAutoComplete address={selfInfo.address} />
          </Stack>
        </StyledFormItem>
        <Transitions
          style={{
            display:
              selfInfo.citizenship !== CommonBorrowerType.foreign_national
                ? 'block'
                : 'none',
            width: '100%',
          }}
        >
          {selfInfo.citizenship !== CommonBorrowerType.foreign_national && (
            <StyledFormItem
              label={`${POSUpperFirstLetter(
                HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun,
              )} Social Security Number`}
              sub
            >
              <Stack gap={3} maxWidth={600} width={'100%'}>
                <StyledTextFieldSocialNumber
                  onValueChange={changeFieldValue('ssn')}
                  validate={selfInfo.errors.ssn}
                  value={selfInfo.ssn}
                />
              </Stack>
            </StyledFormItem>
          )}
        </Transitions>

        {saasState?.posSettings?.softCreditRequirement ===
          SoftCreditRequirementEnum.optional &&
          selfInfo.citizenship !== CommonBorrowerType.foreign_national && (
            <Stack maxWidth={600} width={'100%'}>
              <StyledCheckbox
                checked={selfInfo.isSkipCheck}
                label={
                  <Typography
                    color={'text.primary'}
                    component={'div'}
                    ml={2}
                    variant={'body2'}
                  >
                    Skip soft credit check for now
                  </Typography>
                }
                onChange={(e) =>
                  selfInfo.changeSelfInfo('isSkipCheck', e.target.checked)
                }
                sx={{ maxWidth: 600, width: '100%' }}
              />
            </Stack>
          )}

        <Transitions
          style={{
            width: '100%',
            maxWidth: 600,
          }}
        >
          {!selfInfo.isSkipCheck ||
          selfInfo.citizenship === CommonBorrowerType.foreign_national ? (
            <StyledFormItem label={'Soft credit check authorization'} sub>
              <StyledCheckbox
                checked={selfInfo.authorizedCreditCheck}
                label={
                  <Typography
                    color={'text.primary'}
                    component={'div'}
                    ml={2}
                    variant={'body2'}
                  >
                    {authorizeContent}
                  </Typography>
                }
                onChange={(e) =>
                  selfInfo.changeSelfInfo(
                    'authorizedCreditCheck',
                    e.target.checked,
                  )
                }
                sx={{ width: '100%', maxWidth: 600 }}
              />
            </StyledFormItem>
          ) : (
            <StyledFormItem label={'Please enter your credit score'} sub>
              <StyledTextFieldNumber
                decimalScale={0}
                label={'Credit score'}
                onValueChange={({ floatValue }) => {
                  selfInfo.changeSelfInfo('inputCreditScore', floatValue);
                }}
                thousandSeparator={false}
                validate={selfInfo.errors.inputCreditScore}
                value={selfInfo.inputCreditScore}
              />
            </StyledFormItem>
          )}
        </Transitions>
      </StyledFormItem>
    </>
  );
});
