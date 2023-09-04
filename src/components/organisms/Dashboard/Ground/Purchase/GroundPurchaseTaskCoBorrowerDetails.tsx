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
  CommonBorrowerType,
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskGender,
  DashboardTaskMaritalStatus,
} from '@/types';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_STATE,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_BORROWER_TYPE,
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

export const GroundPurchaseTaskCoBorrowerDetails: FC = observer(() => {
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
  const [citizenship, setCitizenship] = useState<
    CommonBorrowerType | undefined
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
  const [delinquentTimes, setDelinquentTimes] = useState<string | undefined>();
  const [bankruptDate, setBankruptDate] = useState<unknown | Date | null>(null);
  const [foreclosureDate, setForeclosureDate] = useState<unknown | Date | null>(
    null,
  );

  const [ssn, setSsn] = useState<string>('');
  const [authorizedCreditCheck, setAuthorizedCreditCheck] = useState(false);

  const [isConfirm, setIsConfirm] = useState(false);
  const [creditScore, setCreditScore] = useState<number | undefined>();

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          citizenship,
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
          signatoryTitle,
          ssn,
          stateId,
          delinquentTimes,
          bankruptDate,
          foreclosureDate,
          creditScore,
          isConfirm,
        } = res.data;
        if (dateOfBirth) {
          setDateOfBirth(new Date(dateOfBirth));
        }
        if (bankruptDate) {
          setBankruptDate(new Date(bankruptDate));
        }
        if (foreclosureDate) {
          setForeclosureDate(new Date(foreclosureDate));
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
        setDelinquentTimes(delinquentTimes || '');

        setCitizenship(citizenship || undefined);
        setMarital(marital || undefined);
        setGender(gender || undefined);
        setSsn(ssn || undefined);

        setIsConfirm(isConfirm || false);
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
    const conditionA =
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      !!email &&
      dateValid &&
      !!gender &&
      !!marital &&
      address.checkAddressValid &&
      !!ssn &&
      authorizedCreditCheck;

    const conditionB =
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      !!email &&
      dateValid &&
      !!gender &&
      !!marital &&
      address.checkAddressValid;

    if (
      isCoBorrower &&
      (!POSNotUndefined(borrowerType) || !POSNotUndefined(citizenship))
    ) {
      return false;
    }

    if (!isCoBorrower) {
      return true;
    }

    if (borrowerType === DashboardTaskBorrowerType.individual) {
      if (citizenship === CommonBorrowerType.foreign_national) {
        return conditionB;
      }
      return conditionA;
    }
    if (citizenship === CommonBorrowerType.foreign_national) {
      return conditionB;
    }
    return (
      conditionA &&
      !!entityType &&
      !!entityState &&
      !!stateId &&
      !!signatoryTitle
    );
  }, [
    address.checkAddressValid,
    authorizedCreditCheck,
    citizenship,
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
    signatoryTitle,
    ssn,
    stateId,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(dateOfBirth) && isDate(dateOfBirth);
    const bankruptDateValid = isValid(bankruptDate) && isDate(bankruptDate);
    const foreclosureDateValid =
      isValid(foreclosureDate) && isDate(foreclosureDate);
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
        citizenship,
        signatoryTitle,
        ssn,
        stateId,
        delinquentTimes,
        bankruptDate: bankruptDateValid
          ? format(bankruptDate as Date, 'yyyy-MM-dd O')
          : undefined,
        foreclosureDate: foreclosureDateValid
          ? format(foreclosureDate as Date, 'yyyy-MM-dd O')
          : undefined,
        propAddr: address.getPostData(),
      },
    };

    try {
      const res = await _updateTaskFormInfo(postData);
      setCreditScore(res.data);
      if (isCoBorrower && citizenship !== CommonBorrowerType.foreign_national) {
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
    bankruptDate,
    borrowerType,
    citizenship,
    dateOfBirth,
    delinquentTimes,
    email,
    enqueueSnackbar,
    entityState,
    entityType,
    firstName,
    foreclosureDate,
    gender,
    isCoBorrower,
    lastName,
    marital,
    phoneNumber,
    router,
    signatoryTitle,
    ssn,
    stateId,
  ]);

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            margin={'auto 0'}
            minHeight={'calc(667px - 46px)'}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : tableView === 'form' ? (
          <StyledFormItem
            gap={6}
            label={'Co-borrower Details'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              "This means your assets and income will be counted together. You can't remove your co-borrower once you have started your application unless you restart a new one.If there is a co-borrower, credit report and background check fees need to be charged for both individuals."
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={'Would you like to add a co-borrower to your loan?'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledButtonGroup
                  disabled={isConfirm}
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
                        disabled={isConfirm}
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

                  <StyledFormItem
                    label={'What is your citizenship status?'}
                    sub
                  >
                    <Stack maxWidth={600} width={'100%'}>
                      <StyledSelectOption
                        disabled={isConfirm}
                        onChange={(value) =>
                          setCitizenship(value as string as CommonBorrowerType)
                        }
                        options={OPTIONS_COMMON_CITIZEN_TYPE}
                        value={citizenship}
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
                            disabled={isConfirm}
                            label={'Authorized Signatory Title'}
                            onChange={(e) => setSignatoryTitle(e.target.value)}
                            value={signatoryTitle}
                          />
                          <StyledSelect
                            disabled={isConfirm}
                            label={'Entity Type'}
                            onChange={(e) =>
                              setEntityType(
                                e.target
                                  .value as DashboardTaskBorrowerEntityType,
                              )
                            }
                            options={OPTIONS_TASK_ENTITY_TYPE}
                            value={entityType}
                          />
                          <StyledTextField
                            disabled={isConfirm}
                            label={'Secretary of State ID'}
                            onChange={(e) => setStateId(e.target.value)}
                            value={stateId}
                          />
                          <StyledSelect
                            disabled={isConfirm}
                            label={'Formation State'}
                            onChange={(e) =>
                              setEntityState(e.target.value as string)
                            }
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
                        disabled={isConfirm}
                        label={'First Name'}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      />
                      <StyledTextField
                        disabled={isConfirm}
                        label={'Last Name'}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Date of Birth'}
                        onChange={(value) => setDateOfBirth(value)}
                        value={dateOfBirth}
                      />
                      <StyledTextFieldPhone
                        disabled={isConfirm}
                        label={'Phone Number'}
                        onValueChange={({ value }) => setPhoneNumber(value)}
                        value={phoneNumber}
                      />
                      <StyledTextField
                        disabled={isConfirm}
                        label={'Email'}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                      <StyledSelect
                        disabled={isConfirm}
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
                        disabled={isConfirm}
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
                      <StyledTextFieldNumber
                        decimalScale={0}
                        disabled={isConfirm}
                        label={'Delinquent Times'}
                        onValueChange={({ formattedValue }) =>
                          setDelinquentTimes(formattedValue)
                        }
                        thousandSeparator={false}
                        value={delinquentTimes}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Bankruptcy Filing Date'}
                        onChange={(value) => setBankruptDate(value)}
                        value={bankruptDate}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Property Foreclosure Filing Date'}
                        onChange={(value) => setForeclosureDate(value)}
                        value={foreclosureDate}
                      />
                    </Stack>
                  </StyledFormItem>

                  <StyledFormItem label={'Current Address'} sub>
                    <Stack maxWidth={600} width={'100%'}>
                      <StyledGoogleAutoComplete
                        address={address}
                        disabled={isConfirm}
                      />
                    </Stack>
                  </StyledFormItem>

                  {citizenship !== CommonBorrowerType.foreign_national && (
                    <StyledFormItem
                      label={'Your Co-borrower Social Security Number'}
                      sub
                    >
                      <Stack maxWidth={600} width={'100%'}>
                        <StyledTextFieldSocialNumber
                          disabled={isConfirm}
                          label={'Social Security Number'}
                          onValueChange={(v) => setSsn(v)}
                          value={ssn}
                        />
                      </Stack>
                    </StyledFormItem>
                  )}

                  {!isConfirm ? (
                    <StyledCheckbox
                      checked={authorizedCreditCheck}
                      disabled={isConfirm}
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
                              window.open(
                                'https://www.youland.com/legal/terms/',
                              )
                            }
                          >
                            Terms of Use
                          </Typography>
                          ,{' '}
                          <Typography
                            className={'link_style'}
                            component={'span'}
                            onClick={() =>
                              window.open(
                                'https://www.youland.com/legal/privacy/',
                              )
                            }
                          >
                            Privacy Policy
                          </Typography>{' '}
                          and consent to{' '}
                          <Typography
                            className={'link_style'}
                            component={'span'}
                            onClick={() =>
                              window.open(
                                'https://www.youland.com/legal/e-loan-doc/',
                              )
                            }
                          >
                            Receive Electronic Loan Documents
                          </Typography>
                          .
                        </Typography>
                      }
                      onChange={(e) =>
                        setAuthorizedCreditCheck(e.target.checked)
                      }
                      sx={{ maxWidth: 600 }}
                    />
                  ) : citizenship !== CommonBorrowerType.foreign_national ? (
                    <StyledFormItem
                      label={`Credit Score is ${creditScore}`}
                      labelSx={{ m: 0 }}
                      sub
                      tipSx={{ m: 0 }}
                    />
                  ) : null}
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
                color={isConfirm ? 'primary' : 'info'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ flex: 1 }}
                variant={isConfirm ? 'contained' : 'text'}
              >
                Back
              </StyledButton>
              {!isConfirm && (
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
          <Stack
            alignItems={'center'}
            gap={3}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            width={'100%'}
          >
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
              sx={{ width: '100%', maxWidth: 600 }}
            >
              Next
            </StyledButton>
          </Stack>
        )}
      </Transitions>
    </>
  );
});