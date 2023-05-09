import { Stack, Typography } from '@mui/material';
import { ChangeEvent, FC, useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';
import {
  IPersonalInfo,
  SPersonalInfo,
} from '@/models/application/common/CreditScore';

import {
  StyledButtonGroup,
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';
import { NumberFormatValues } from 'react-number-format';

export const BridgeCoBorrowerInfo: FC = observer(() => {
  const {
    applicationForm: {
      formData: { creditScore },
    },
    userType,
  } = useMst();

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
        label={'Would you like to add a co-borrower to your loan?'}
        tip={
          <>
            <Typography color={'info.main'} variant={'body1'}>
              This means your assets and income will be counted together. You
              can&apos;t remove your co-borrower once you have started your
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
            creditScore.changeCoBorrowerCondition(
              'isCoBorrower',
              value === 'yes',
            );
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
            label={'Tell us about your co-borrower'}
            labelSx={{ mb: 0 }}
            tip={
              "We are only collecting co-borrower's information for now. Checking credit score will be done in tasks."
            }
            tipSx={{ mb: 0 }}
          >
            <StyledFormItem
              label={'Personal Information'}
              sub
              tip={
                "By entering your phone number,  you're authorizing YouLand to use this number to call, text and send you messages by any method. We don't charge for contacting you, but your service provider may."
              }
            >
              <Stack gap={3} width={'100%'}>
                <Stack flexDirection={'row'} gap={3}>
                  <StyledTextField
                    label={'First Name'}
                    onChange={changeFieldValue('firstName')}
                    placeholder={'First Name'}
                    validate={coBorrowerInfo.errors.firstName}
                    value={coBorrowerInfo.firstName}
                  />
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
                    label={'MM/DD/YYYY'}
                    onChange={changeFieldValue('dateOfBirth')}
                    validate={coBorrowerInfo.errors.dateOfBirth}
                    value={coBorrowerInfo.dateOfBirth}
                  />
                </Stack>
                <Stack flexDirection={'row'} gap={3}>
                  <StyledTextFieldPhone
                    label={'Phone Number'}
                    onValueChange={changeFieldValue('phoneNumber')}
                    placeholder={'Phone Number'}
                    validate={coBorrowerInfo.errors.phoneNumber}
                    value={coBorrowerInfo.phoneNumber}
                  />
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
              <StyledGoogleAutoComplete address={coBorrowerInfo.address} />
            </StyledFormItem>
            <StyledFormItem
              label={'Your Co-borrower Social Security Number'}
              sub
            >
              <StyledTextFieldSocialNumber
                onValueChange={changeFieldValue('ssn')}
                validate={coBorrowerInfo.errors.ssn}
                value={coBorrowerInfo.ssn}
              />
            </StyledFormItem>
            <StyledCheckbox
              checked={coBorrowerInfo.authorizedCreditCheck}
              label={
                <Typography
                  color={'text.primary'}
                  component={'div'}
                  ml={2}
                  variant={'body2'}
                >
                  I, {coBorrowerInfo.firstName || 'borrower'}{' '}
                  {coBorrowerInfo.lastName || 'name'} , authorize YouLand to
                  verify my credit. I&apos;ve also read and agreed to
                  YouLand&apos;s{' '}
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
              sx={{ maxWidth: 'auto' }}
            />
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
