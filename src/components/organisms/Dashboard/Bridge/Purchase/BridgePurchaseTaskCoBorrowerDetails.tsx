import { FC, useCallback, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';

import { POSNotUndefined } from '@/utils';
import { useSessionStorageState } from '@/hooks';
import { Address, IAddress } from '@/models/common/Address';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskGender,
  DashboardTaskMaritalStatus,
} from '@/types';
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
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';

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
import { DashboardScoreResult } from '@/components/molecules';

export const BridgePurchaseTaskCoBorrowerDetails: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [tableView, setTableView] = useState<'form' | 'score'>('form');

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
  const [dateOfBirth, setDateOfBirth] = useState<unknown | Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');
  const [email, setEmail] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [marital, setMarital] = useState<string | undefined>();
  const [residency, setResidency] = useState<string | undefined>();
  const [trackRecord, setTrackRecord] = useState<string | undefined>();

  const [ssn, setSsn] = useState<string>('');
  const [authorizedCreditCheck, setAuthorizedCreditCheck] = useState(false);

  const [hasCreditScore, setHasCreditScore] = useState(false);
  const [creditScore, setCreditScore] = useState<number | undefined>();

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
          creditScore,
          hasCreditScore,
        } = res.data;
        if (dateOfBirth) {
          setDateOfBirth(new Date(dateOfBirth));
        }
        setIsCoBorrower(isCoBorrower);
        setBorrowerType(borrowerType || undefined);

        setEntityType(entityType || undefined);
        setEntityState(entityState || undefined);
        setStateId(stateId || '');
        setSignatoryTitle(signatoryTitle || '');

        setFirstName(firstName || '');
        setLastName(lastName || '');
        setPhoneNumber(phoneNumber || undefined);
        setEmail(email || '');
        setTrackRecord(trackRecord || '');
        setResidency(residency || undefined);
        setMarital(marital || undefined);
        setGender(gender || undefined);
        setSsn(ssn || undefined);

        setHasCreditScore(hasCreditScore || false);
        setCreditScore(creditScore || 0);

        setAuthorizedCreditCheck(authorizedCreditCheck || false);

        setTimeout(() => {
          address.injectServerData(propAddr);
        });
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    if (!POSNotUndefined(isCoBorrower)) {
      return false;
    }

    const dateValid = isValid(dateOfBirth) && isDate(dateOfBirth);
    const condition =
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      !!email &&
      dateValid &&
      !!gender &&
      !!marital &&
      !!residency &&
      !!trackRecord &&
      address.checkAddressValid &&
      !!ssn &&
      authorizedCreditCheck;

    if (
      isCoBorrower &&
      (!POSNotUndefined(borrowerType) ||
        !POSNotUndefined(authorizedCreditCheck))
    ) {
      return false;
    }

    if (!isCoBorrower) {
      return true;
    }

    return borrowerType === DashboardTaskBorrowerType.individual
      ? condition
      : condition &&
          !!entityType &&
          !!entityState &&
          !!stateId &&
          !!signatoryTitle;
  }, [
    address.checkAddressValid,
    authorizedCreditCheck,
    borrowerType,
    dateOfBirth,
    email,
    entityState,
    entityType,
    firstName,
    gender,
    isCoBorrower,
    lastName,
    marital,
    phoneNumber,
    residency,
    signatoryTitle,
    ssn,
    stateId,
    trackRecord,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(dateOfBirth) && isDate(dateOfBirth);
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        authorizedCreditCheck,
        borrowerType,
        dateOfBirth: dateValid
          ? format(dateOfBirth as Date, 'yyyy-MM-dd O')
          : undefined,
        email,
        entityState,
        entityType,
        firstName,
        gender,
        isCoBorrower,
        lastName,
        marital,
        phoneNumber,
        residency,
        signatoryTitle,
        ssn,
        stateId,
        trackRecord,
        propAddr: address.getPostData(),
      },
    };

    try {
      const res = await _updateTaskFormInfo(postData);
      setCreditScore(res.data);
      if (isCoBorrower) {
        setTableView('score');
      } else {
        await router.push({
          pathname: '/dashboard/tasks',
          query: { processId: router.query.processId },
        });
      }
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [
    address,
    authorizedCreditCheck,
    borrowerType,
    dateOfBirth,
    email,
    enqueueSnackbar,
    entityState,
    entityType,
    firstName,
    gender,
    isCoBorrower,
    lastName,
    marital,
    phoneNumber,
    residency,
    router.query.taskId,
    signatoryTitle,
    ssn,
    stateId,
    trackRecord,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : tableView === 'form' ? (
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
            disabled={hasCreditScore}
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
                  disabled={hasCreditScore}
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
                      disabled={hasCreditScore}
                      label={'Authorized Signatory Title'}
                      onChange={(e) => setSignatoryTitle(e.target.value)}
                      value={signatoryTitle}
                    />
                    <StyledSelect
                      disabled={hasCreditScore}
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
                      disabled={hasCreditScore}
                      label={'Secretary of State ID'}
                      onChange={(e) => setStateId(e.target.value)}
                      value={stateId}
                    />
                    <StyledSelect
                      disabled={hasCreditScore}
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
              tip={`By entering your phone number,  you're authorizing ${
                //sass
                saasState?.organizationName || 'YouLand'
              } to use this number to call, text and send you messages by any method. We don't charge for contacting you, but your service provider may.`}
            >
              <Stack gap={3} maxWidth={600} width={'100%'}>
                <StyledTextField
                  disabled={hasCreditScore}
                  label={'First Name'}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
                <StyledTextField
                  disabled={hasCreditScore}
                  label={'Last Name'}
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
                <StyledDatePicker
                  disabled={hasCreditScore}
                  label={'MM/DD/YYYY'}
                  onChange={(value) => setDateOfBirth(value)}
                  value={dateOfBirth}
                />
                <StyledTextFieldPhone
                  disabled={hasCreditScore}
                  label={'Phone Number'}
                  onValueChange={({ value }) => setPhoneNumber(value)}
                  value={phoneNumber}
                />
                <StyledTextField
                  disabled={hasCreditScore}
                  label={'Email'}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <StyledSelect
                  disabled={hasCreditScore}
                  label={'Gender'}
                  onChange={(e) =>
                    setGender(e.target.value as string as DashboardTaskGender)
                  }
                  options={OPTIONS_TASK_GENDER}
                  value={gender}
                />
                <StyledSelect
                  disabled={hasCreditScore}
                  label={'Marital Status'}
                  onChange={(e) =>
                    setMarital(
                      e.target.value as string as DashboardTaskMaritalStatus,
                    )
                  }
                  options={OPTIONS_TASK_MARTIAL_STATUS}
                  value={marital}
                />
                <StyledSelect
                  disabled={hasCreditScore}
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
                  decimalScale={0}
                  disabled={hasCreditScore}
                  label={'Track Record'}
                  onValueChange={({ formattedValue }) =>
                    setTrackRecord(formattedValue)
                  }
                  thousandSeparator={false}
                  value={trackRecord}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Current Address'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledGoogleAutoComplete
                  address={address}
                  disabled={hasCreditScore}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'Your Co-borrower Social Security Number'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldSocialNumber
                  disabled={hasCreditScore}
                  label={'Social Security Number'}
                  onValueChange={(v) => setSsn(v)}
                  value={ssn}
                />
              </Stack>
            </StyledFormItem>

            {!hasCreditScore ? (
              <StyledCheckbox
                checked={authorizedCreditCheck}
                disabled={hasCreditScore}
                label={
                  <Typography
                    color={'text.primary'}
                    component={'div'}
                    ml={2}
                    variant={'body2'}
                  >
                    I, {firstName || 'borrower'} {lastName || 'name'} ,
                    authorize{' '}
                    {
                      //sass
                      saasState?.organizationName || 'YouLand'
                    }{' '}
                    to verify my credit. I&apos;ve also read and agreed to{' '}
                    {
                      //sass
                      saasState?.organizationName || 'YouLand'
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
            ) : (
              <StyledFormItem
                label={`Credit Score is ${creditScore}`}
                labelSx={{ m: 0 }}
                sub
                tipSx={{ m: 0 }}
              />
            )}
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
          color={hasCreditScore ? 'primary' : 'info'}
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
          sx={{ flex: 1 }}
          variant={hasCreditScore ? 'contained' : 'text'}
        >
          Back
        </StyledButton>
        {!hasCreditScore && (
          <StyledButton
            disabled={!isDisabled || saveLoading}
            loading={saveLoading}
            loadingText={'Saving...'}
            onClick={handledSubmit}
            sx={{ flex: 1 }}
          >
            Next
          </StyledButton>
        )}
      </Stack>
    </StyledFormItem>
  ) : (
    <Stack alignItems={'center'} gap={3}>
      <DashboardScoreResult score={creditScore} />
      <StyledButton
        disabled={!isDisabled || saveLoading}
        loading={saveLoading}
        loadingText={'Saving...'}
        onClick={async () => {
          if (creditScore && creditScore > 640) {
            await router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            });
          }
          setTableView('form');
        }}
        sx={{
          width: '100%',
          maxWidth: 600,
        }}
      >
        Back
      </StyledButton>
    </Stack>
  );
});
