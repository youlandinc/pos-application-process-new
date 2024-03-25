import { FC, useCallback, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { useSessionStorageState } from '@/hooks';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_GENDER,
  OPTIONS_TASK_MARTIAL_STATUS,
} from '@/constants';
import { Address, IAddress } from '@/models/common/Address';
import {
  CommonBorrowerType,
  DashboardTaskGender,
  DashboardTaskMaritalStatus,
  HttpError,
  SoftCreditRequirementEnum,
} from '@/types';
import { POSFormatUrl, POSNotUndefined } from '@/utils';
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

export const GroundRefinanceTaskCoBorrowerDetails: FC = observer(() => {
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
  const [citizenship, setCitizenship] = useState<
    CommonBorrowerType | undefined
  >();

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

  const [isSkipCheck, setIsSkipCheck] = useState<boolean>(false);
  const [inputCreditScore, setInputCreditScore] = useState<
    number | undefined
  >();
  const [inputCreditScoreError, setInputCreditScoreError] = useState<
    string[] | undefined
  >(undefined);

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
          dateOfBirth,
          email,
          firstName,
          lastName,
          gender,
          marital,
          phoneNumber,
          propAddr,
          ssn,
          delinquentTimes,
          bankruptDate,
          foreclosureDate,
          creditScore,
          isConfirm,
          isSkipCheck,
          inputCreditScore,
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

        setFirstName(firstName || '');
        setLastName(lastName || '');
        setPhoneNumber(phoneNumber || '');
        setEmail(email || '');
        setDelinquentTimes(delinquentTimes || '');

        setCitizenship(citizenship || undefined);
        setMarital(marital || undefined);
        setGender(gender || undefined);

        setSsn(ssn || '');

        setIsConfirm(isConfirm || false);
        setCreditScore(creditScore || 0);

        setIsSkipCheck(isSkipCheck || false);
        setInputCreditScore(inputCreditScore || undefined);

        setAuthorizedCreditCheck(authorizedCreditCheck || false);

        setTimeout(() => {
          address.injectServerData(propAddr);
        });
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    if (!POSNotUndefined(isCoBorrower)) {
      return true;
    }

    if (!isCoBorrower) {
      return false;
    }

    const dateValid = isValid(dateOfBirth) && isDate(dateOfBirth);
    const baseCondition = [
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      marital,
      dateValid,
    ].some((item) => !item);

    const conditionForeign = baseCondition || !address.checkAddressValid;

    const conditionLocal =
      baseCondition ||
      !address.checkAddressValid ||
      !authorizedCreditCheck ||
      !ssn;

    if (
      saasState?.posSettings?.softCreditRequirement ===
      SoftCreditRequirementEnum.optional
    ) {
      if (citizenship === CommonBorrowerType.foreign_national) {
        return conditionForeign || !authorizedCreditCheck;
      }
      if (isSkipCheck) {
        return conditionForeign || !inputCreditScore;
      }
      return conditionLocal;
    }
    return citizenship === CommonBorrowerType.foreign_national
      ? conditionForeign
      : conditionLocal;
  }, [
    isCoBorrower,
    dateOfBirth,
    firstName,
    lastName,
    phoneNumber,
    email,
    gender,
    marital,
    address.checkAddressValid,
    authorizedCreditCheck,
    ssn,
    saasState?.posSettings?.softCreditRequirement,
    citizenship,
    isSkipCheck,
    inputCreditScore,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(dateOfBirth) && isDate(dateOfBirth);
    const bankruptDateValid = isValid(bankruptDate) && isDate(bankruptDate);
    const foreclosureDateValid =
      isValid(foreclosureDate) && isDate(foreclosureDate);
    setSaveLoading(true);
    setInputCreditScoreError(undefined);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        authorizedCreditCheck,
        dateOfBirth: dateValid
          ? format(dateOfBirth as Date, 'yyyy-MM-dd O')
          : undefined,
        email,
        firstName,
        gender,
        isCoBorrower,
        lastName,
        marital,
        phoneNumber,
        citizenship,
        ssn,
        delinquentTimes,
        bankruptDate: bankruptDateValid
          ? format(bankruptDate as Date, 'yyyy-MM-dd O')
          : undefined,
        foreclosureDate: foreclosureDateValid
          ? format(foreclosureDate as Date, 'yyyy-MM-dd O')
          : undefined,
        propAddr: address.getPostData(),
        isSkipCheck,
        inputCreditScore,
      },
    };

    if (citizenship !== CommonBorrowerType.foreign_national && isSkipCheck) {
      if (
        !inputCreditScore ||
        inputCreditScore <= 300 ||
        inputCreditScore >= 850
      ) {
        setInputCreditScoreError(['The score must be between 300 and 850.']);
        setSaveLoading(false);
        return;
      }
    }

    try {
      const res = await _updateTaskFormInfo(postData);
      setCreditScore(res.data);
      if (
        isCoBorrower &&
        citizenship !== CommonBorrowerType.foreign_national &&
        !isSkipCheck
      ) {
        setTableView('score');
      } else {
        await router.push({
          pathname: '/dashboard/tasks',
          query: { processId: router.query.processId },
        });
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [
    address,
    authorizedCreditCheck,
    bankruptDate,
    citizenship,
    dateOfBirth,
    delinquentTimes,
    email,
    enqueueSnackbar,
    firstName,
    foreclosureDate,
    gender,
    inputCreditScore,
    isCoBorrower,
    isSkipCheck,
    lastName,
    marital,
    phoneNumber,
    router,
    ssn,
  ]);

  const renderViaIsSkip = useMemo(() => {
    if (!isConfirm) {
      return saasState?.posSettings?.softCreditRequirement ===
        SoftCreditRequirementEnum.optional &&
        isSkipCheck &&
        citizenship !== CommonBorrowerType.foreign_national ? (
        <StyledFormItem
          label={"Co-borrower's credit score"}
          mt={4}
          sub
          sx={{ maxWidth: 600, width: '100%' }}
        >
          <StyledTextFieldNumber
            decimalScale={0}
            disabled={isConfirm}
            label={'Credit score'}
            onValueChange={({ floatValue }) => {
              setInputCreditScore(floatValue);
            }}
            percentage={false}
            thousandSeparator={false}
            validate={inputCreditScoreError}
            value={inputCreditScore}
          />
        </StyledFormItem>
      ) : (
        <StyledFormItem
          label={'Soft credit check authorization'}
          labelSx={{ mb: 2 }}
          mt={4}
          sub
          sx={{ width: '100%', maxWidth: 600 }}
        >
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
                I authorize {saasState?.organizationName || 'YouLand'} to verify{' '}
                {firstName
                  ? lastName
                    ? `${firstName?.replace(/\b\w/g, (char) =>
                        char.toUpperCase(),
                      )} `
                    : firstName?.replace(/\b\w/g, (char) => char.toUpperCase())
                  : 'the '}
                {firstName
                  ? lastName
                    ? `${lastName?.replace(/\b\w/g, (char) =>
                        char.toUpperCase(),
                      )}`
                    : ''
                  : 'co-borrower'}
                &apos;s credit. I&apos;ve also read and agreed to{' '}
                {saasState?.organizationName || 'YouLand'}&apos;s{' '}
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
                      POSFormatUrl(
                        saasState?.legalAgreements?.privacyPolicyUrl,
                      ) || 'https://www.youland.com/legal/privacy/',
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
                  Consent to Receive Electronic Loan Documents
                </Typography>
                .
              </Typography>
            }
            onChange={(e) => setAuthorizedCreditCheck(e.target.checked)}
            sx={{ width: '100%' }}
          />
        </StyledFormItem>
      );
    }
    return saasState?.posSettings?.softCreditRequirement ===
      SoftCreditRequirementEnum.optional && isSkipCheck ? (
      <StyledFormItem
        label={"Co-borrower's credit score"}
        sub
        sx={{ width: '100%', maxWidth: 600 }}
      >
        <StyledTextFieldNumber
          decimalScale={0}
          disabled={isConfirm}
          label={'Credit score'}
          onValueChange={({ floatValue }) => {
            setInputCreditScore(floatValue);
          }}
          percentage={false}
          thousandSeparator={false}
          value={inputCreditScore}
        />
      </StyledFormItem>
    ) : citizenship !== CommonBorrowerType.foreign_national ? (
      <StyledFormItem
        label={`Credit score is ${creditScore}`}
        labelSx={{ m: 0 }}
        mt={4}
        sub
        tipSx={{ m: 0 }}
      />
    ) : null;
  }, [
    authorizedCreditCheck,
    citizenship,
    creditScore,
    firstName,
    inputCreditScore,
    inputCreditScoreError,
    isConfirm,
    isSkipCheck,
    lastName,
    saasState?.legalAgreements?.privacyPolicyUrl,
    saasState?.legalAgreements?.signaturesUrl,
    saasState?.legalAgreements?.termsUrl,
    saasState?.organizationName,
    saasState?.posSettings?.softCreditRequirement,
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
            label={'Co-borrower details'}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              "If added, the co-borrower can't be removed without starting a new application. Credit and background checks would apply to the co-borrower as well."
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
                gap: 24,
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              {isCoBorrower && (
                <>
                  <StyledFormItem
                    label={'Personal information'}
                    sub
                    tip={`By entering their phone number and email address below, you're authorizing ${
                      saasState?.organizationName || 'YouLand'
                    } to contact them using those methods. Carrier fees may apply.`}
                  >
                    <Stack gap={3} maxWidth={600} width={'100%'}>
                      <StyledTextField
                        disabled={isConfirm}
                        label={'First name'}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      />
                      <StyledTextField
                        disabled={isConfirm}
                        label={'Last name'}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Date of birth'}
                        onChange={(value) => setDateOfBirth(value)}
                        value={dateOfBirth}
                      />
                      <StyledTextFieldPhone
                        disabled={isConfirm}
                        label={'Phone number'}
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
                        label={'Marital status'}
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
                        label={'Delinquent times'}
                        onValueChange={({ formattedValue }) =>
                          setDelinquentTimes(formattedValue)
                        }
                        thousandSeparator={false}
                        value={delinquentTimes}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Bankruptcy filing date'}
                        onChange={(value) => setBankruptDate(value)}
                        value={bankruptDate}
                      />
                      <StyledDatePicker
                        disabled={isConfirm}
                        label={'Property foreclosure filing date'}
                        onChange={(value) => setForeclosureDate(value)}
                        value={foreclosureDate}
                      />
                    </Stack>
                  </StyledFormItem>

                  <StyledFormItem
                    label={'What is your citizenship status?'}
                    mt={5}
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

                  <StyledFormItem label={'Current address'} mt={5} sub>
                    <Stack maxWidth={600} width={'100%'}>
                      <StyledGoogleAutoComplete
                        address={address}
                        disabled={isConfirm}
                      />
                    </Stack>
                  </StyledFormItem>

                  {citizenship !== CommonBorrowerType.foreign_national && (
                    <StyledFormItem
                      label={"Co-borrower's social security number"}
                      mt={5}
                      sub
                    >
                      <Stack maxWidth={600} width={'100%'}>
                        <StyledTextFieldSocialNumber
                          disabled={isConfirm}
                          label={'Social security number'}
                          onValueChange={(v) => setSsn(v)}
                          value={ssn}
                        />
                      </Stack>
                    </StyledFormItem>
                  )}

                  {saasState?.posSettings?.softCreditRequirement ===
                    SoftCreditRequirementEnum.optional &&
                    citizenship !== CommonBorrowerType.foreign_national &&
                    !isConfirm && (
                      <StyledFormItem
                        label={''}
                        labelSx={{ display: 'none' }}
                        sx={{ maxWidth: 600, width: '100%' }}
                      >
                        <StyledCheckbox
                          checked={isSkipCheck}
                          disabled={isConfirm}
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
                          onChange={(e) => setIsSkipCheck(e.target.checked)}
                          sx={{ width: '100%' }}
                        />
                      </StyledFormItem>
                    )}
                  {renderViaIsSkip}
                </>
              )}
            </Transitions>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              mt={4}
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
                  disabled={isDisabled || saveLoading}
                  loading={saveLoading}
                  loadingText={'Saving...'}
                  onClick={handledSubmit}
                  sx={{ flex: 1 }}
                >
                  {saasState?.posSettings?.softCreditRequirement ===
                  SoftCreditRequirementEnum.optional
                    ? citizenship === CommonBorrowerType.foreign_national
                      ? 'Save'
                      : isSkipCheck
                        ? 'Save'
                        : 'Next'
                    : 'Next'}
                </StyledButton>
              )}
            </Stack>
          </StyledFormItem>
        ) : (
          <Stack
            alignItems={'center'}
            gap={8}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            width={'100%'}
          >
            <DashboardScoreResult score={creditScore} />
            <StyledButton
              disabled={isDisabled || saveLoading}
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
