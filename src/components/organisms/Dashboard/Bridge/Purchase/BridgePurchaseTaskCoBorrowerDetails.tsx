import { FC, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { Address, IAddress } from '@/models/common/Address';
import {
  AUTO_HIDE_DURATION,
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
  StyledLoading,
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
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

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

  const [isCoBorrower, setIsCoBorrower] = useState<boolean>();
  const [borrowerType, setBorrowerType] = useState<
    DashboardTaskBorrowerType | undefined
  >();

  const [signatoryTitle, setSignatoryTitle] = useState<string | undefined>();
  const [entityType, setEntityType] = useState<string | undefined>();
  const [stateId, setStateId] = useState<string | undefined>();
  const [entityState, setEntityState] = useState<string | undefined>();

  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<unknown | Date | null>();
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');
  const [email, setEmail] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [marital, setMarital] = useState<string | undefined>();
  const [residency, setResidency] = useState<string | undefined>();
  const [trackRecord, setTrackRecord] = useState<string | undefined>();

  const [ssn, setSsn] = useState<string>('');
  const [authorizedCreditCheck, setAuthorizedCreditCheck] = useState(false);

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          isCoBorrower,
          authorizedCreditCheck,
          borrowerType,
          dateOfBirth,
          email,
          entityState,
          entityType,
          firstName,
          lastName,
          gender,
          marital,
          phoneNumber,
          propAddr,
          residency,
          signatoryTitle,
          ssn,
          stateId,
          trackRecord,
        } = res.data;
        if (dateOfBirth) {
          setDateOfBirth(new Date(dateOfBirth));
        }
        setIsCoBorrower(isCoBorrower);
        setBorrowerType(borrowerType);

        setEntityType(entityType);
        setEntityState(entityState);
        setStateId(stateId);
        setSignatoryTitle(signatoryTitle);

        setFirstName(firstName);
        setLastName(lastName);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        setTrackRecord(trackRecord);
        setResidency(residency);
        setMarital(marital);
        setGender(gender);
        setSsn(ssn);

        setAuthorizedCreditCheck(authorizedCreditCheck);

        setTimeout(() => {
          address.injectServerData(propAddr);
        });
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return false;
  }, []);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {},
    };
    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [enqueueSnackbar, router]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
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
          flexDirection: 'column',
          gap: 48,
          alignItems: 'center',
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
                      onChange={(e) => setSignatoryTitle(e.target.value)}
                      value={signatoryTitle}
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
                      onChange={(e) => setEntityState(e.target.value as string)}
                      options={OPTIONS_COMMON_STATE}
                      value={entityState}
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
                  label={'MM/DD/YYYY'}
                  onChange={(value) => setDateOfBirth(value)}
                  value={dateOfBirth}
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
                    flexDirection: 'column',
                    gap: 24,
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
                          setMarital(
                            e.target
                              .value as string as DashboardTaskMaritalStatus,
                          )
                        }
                        options={OPTIONS_TASK_MARTIAL_STATUS}
                        value={marital}
                      />
                      <StyledSelect
                        label={'Residency Status'}
                        onChange={(e) =>
                          setResidency(
                            e.target
                              .value as string as DashboardTaskCitizenshipStatus,
                          )
                        }
                        options={OPTIONS_TASK_CITIZENSHIP_STATUS}
                        value={residency}
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
              checked={authorizedCreditCheck}
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
              onChange={(e) => setAuthorizedCreditCheck(e.target.checked)}
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
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton
          disabled={isDisabled || saveLoading}
          loading={saveLoading}
          loadingText={'Saving...'}
          onClick={handledSubmit}
          sx={{ flex: 1 }}
        >
          Save
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
