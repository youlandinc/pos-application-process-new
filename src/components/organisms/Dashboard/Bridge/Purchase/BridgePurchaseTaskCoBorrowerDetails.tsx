import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { Address, IAddress } from '@/models/common/Address';
import {
  OPTIONS_COMMON_STATE,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_BORROWER_TYPE,
  OPTIONS_TASK_CITIZENSHIP_STATUS,
  OPTIONS_TASK_ENTITY_TYPE,
  OPTIONS_TASK_GENDER,
  OPTIONS_TASK_MARTIAL_STATUS,
} from '@/constants';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskGender,
  DashboardTaskMaritalStatus,
} from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldNumber,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskCoBorrowerDetails: FC = observer(() => {
  const router = useRouter();

  const [isCoBorrower, setIsCoBorrower] = useState<boolean | undefined>();
  const [borrowerType, setBorrowerType] = useState<
    DashboardTaskBorrowerType | undefined
  >();

  const [signatory, setSignatory] = useState<string | undefined>();
  const [entityType, setEntityType] = useState<string | undefined>();
  const [stateId, setStateId] = useState<string | undefined>();
  const [formationState, setFormationState] = useState<string | undefined>();

  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [date, setDate] = useState<unknown | Date | null>();
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');
  const [email, setEmail] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [maritalStatus, setMaritalStatus] = useState<string | undefined>();
  const [residencyStatus, setResidencyStatus] = useState<string | undefined>();
  const [trackRecord, setTrackRecord] = useState<string | undefined>();

  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [ssn, setSsn] = useState<string>('');
  const [isCheck, setIsCheck] = useState(false);

  return (
    <StyledFormItem
      gap={6}
      label={'Co-borrower Details'}
      tip={
        "This means your assets and income will be counted together. You can't remove your co-borrower once you have started your application unless you restart a new one."
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'Would you like to add a co-borrower to your loan?'}
        sub
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value !== null) {
                setIsCoBorrower(value === 'yes');
              }
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            value={isCoBorrower}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display: isCoBorrower ? 'flex' : 'none',
          width: '100%',
          gap: 24,
          flexDirection: 'column',
        }}
      >
        {isCoBorrower && (
          <>
            <StyledFormItem
              label={'Borrower Type'}
              sub
              tip={
                'If you represent an entity, please update the borrower type below, We will convert the co-borrower information into a guarantor for this entity.'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) =>
                    setBorrowerType(
                      value as string as DashboardTaskBorrowerType,
                    )
                  }
                  options={OPTIONS_TASK_BORROWER_TYPE}
                  value={borrowerType}
                />
              </Stack>
            </StyledFormItem>

            <Transitions
              style={{
                display:
                  borrowerType === DashboardTaskBorrowerType.entity
                    ? 'flex'
                    : 'none',
                width: '100%',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {borrowerType === DashboardTaskBorrowerType.entity && (
                <StyledFormItem label={'Entity Information'} sub>
                  <Stack
                    flexDirection={'column'}
                    gap={3}
                    maxWidth={600}
                    width={'100%'}
                  >
                    <StyledTextField
                      label={'Authorized Signatory Title'}
                      onChange={(e) => setSignatory(e.target.value)}
                      value={signatory}
                    />
                    <StyledSelect
                      label={'Entity Type'}
                      onChange={(e) =>
                        setEntityType(
                          e.target.value as DashboardTaskBorrowerEntityType,
                        )
                      }
                      options={OPTIONS_TASK_ENTITY_TYPE}
                      value={entityType}
                    />
                    <StyledTextField
                      label={'Secretary of State ID'}
                      onChange={(e) => setStateId(e.target.value)}
                      value={stateId}
                    />
                    <StyledSelect
                      label={'Formation State'}
                      onChange={(e) =>
                        setFormationState(e.target.value as string)
                      }
                      options={OPTIONS_COMMON_STATE}
                      value={formationState}
                    />
                  </Stack>
                </StyledFormItem>
              )}
            </Transitions>

            <StyledFormItem
              label={'Personal Information'}
              sub
              tip={
                "By entering your phone number,  you're authorizing {Organization Name} to use this number to call, text and send you messages by any method. We don't charge for contacting you, but your service provider may."
              }
            >
              <Stack gap={3} maxWidth={600} width={'100%'}>
                <StyledTextField
                  label={'First Name'}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
                <StyledTextField
                  label={'Last Name'}
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
                <StyledDatePicker
                  label={'MM/DD/YY'}
                  onChange={(value) => setDate(value)}
                  value={date}
                />
                <StyledTextFieldPhone
                  label={'Phone Number'}
                  onValueChange={({ value }) => setPhoneNumber(value)}
                  value={phoneNumber}
                />
                <StyledTextField
                  label={'Email'}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <Transitions
                  style={{
                    display:
                      borrowerType === DashboardTaskBorrowerType.entity
                        ? 'flex'
                        : 'none',
                    width: '100%',
                  }}
                >
                  {borrowerType === DashboardTaskBorrowerType.entity && (
                    <>
                      <StyledSelect
                        label={'Gender'}
                        onChange={(e) =>
                          setGender(
                            e.target.value as string as DashboardTaskGender,
                          )
                        }
                        options={OPTIONS_TASK_GENDER}
                        value={gender}
                      />
                      <StyledSelect
                        label={'Marital Status'}
                        onChange={(e) =>
                          setMaritalStatus(
                            e.target
                              .value as string as DashboardTaskMaritalStatus,
                          )
                        }
                        options={OPTIONS_TASK_MARTIAL_STATUS}
                        value={maritalStatus}
                      />
                      <StyledSelect
                        label={'Residency Status'}
                        onChange={(e) =>
                          setResidencyStatus(
                            e.target
                              .value as string as DashboardTaskCitizenshipStatus,
                          )
                        }
                        options={OPTIONS_TASK_CITIZENSHIP_STATUS}
                        value={residencyStatus}
                      />
                      <StyledTextFieldNumber
                        label={'Track Record'}
                        onValueChange={({ formattedValue }) =>
                          setTrackRecord(formattedValue)
                        }
                        value={trackRecord}
                      />
                    </>
                  )}
                </Transitions>
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Current Address'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledGoogleAutoComplete address={address} />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'Your Co-borrower Social Security Number'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldSocialNumber
                  label={'Social Security Number'}
                  onValueChange={(v) => setSsn(v)}
                  value={ssn}
                />
              </Stack>
            </StyledFormItem>

            <StyledCheckbox
              checked={isCheck}
              label={
                <Typography
                  color={'text.primary'}
                  component={'div'}
                  ml={2}
                  variant={'body2'}
                >
                  I, {firstName || 'borrower'} {lastName || 'name'} , authorize
                  {
                    //sass
                    ' YouLand'
                  }{' '}
                  to verify my credit. I&apos;ve also read and agreed to
                  {
                    //sass
                    ' YouLand'
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
              onChange={(e) => setIsCheck(e.target.checked)}
              sx={{ maxWidth: 600 }}
            />
          </>
        )}
      </Transitions>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() => router.push('/dashboard/tasks')}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
