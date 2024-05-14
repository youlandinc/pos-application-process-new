import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { Address, IAddress } from '@/models/common/Address';

import { POSGetParamsFromUrl } from '@/utils';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_YES_OR_NO,
} from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

import {
  DashboardTaskCitizenshipStatus,
  DashboardTaskKey,
  HttpError,
  LoanAnswerEnum,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksCoBorrower: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);

  const [isCoBorrower, setIsCoBorrower] = useState<boolean>(false);

  const [citizenship, setCitizenship] =
    useState<DashboardTaskCitizenshipStatus>(
      DashboardTaskCitizenshipStatus.default,
    );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<unknown | Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');

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

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: {
            isCoBorrower,
            citizenship,
            firstName,
            lastName,
            birthDate,
            phoneNumber,
            email,
            ssn,
            addressInfo,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.co_borrower,
      });

      setIsCoBorrower(isCoBorrower);

      setFirstName(firstName ?? '');
      setLastName(lastName ?? '');
      setBirthDate(birthDate ? new Date(birthDate) : null);
      setPhoneNumber(phoneNumber ?? '');
      setEmail(email ?? '');

      setCitizenship(citizenship ?? DashboardTaskCitizenshipStatus.default);

      setSsn(ssn ?? '');

      address.injectServerData(addressInfo);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const isFormDataValid = useMemo(() => {
    if (!isCoBorrower) {
      return true;
    }

    const dateCondition = isValid(birthDate) && isDate(birthDate);
    const baseCondition =
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      !!email &&
      address.isValid &&
      dateCondition;

    if (!citizenship) {
      return false;
    }
    if (citizenship === DashboardTaskCitizenshipStatus.foreign_national) {
      return baseCondition;
    }
    return baseCondition && !!ssn;
  }, [
    address.isValid,
    birthDate,
    citizenship,
    email,
    firstName,
    isCoBorrower,
    lastName,
    phoneNumber,
    ssn,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.co_borrower,
      data: {
        isCoBorrower,
        citizenship: citizenship || undefined,
        firstName,
        lastName,
        birthDate:
          isValid(birthDate) && isDate(birthDate)
            ? format(birthDate as Date, 'yyyy-MM-dd')
            : null,
        phoneNumber,
        email,
        ssn,
        addressInfo: address.getPostData(),
      },
    };

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { loanId: router.query.loanId },
      });
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
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        alignItems={'center'}
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={648}
        mx={'auto'}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          color={'text.primary'}
          fontSize={{ xs: 20, lg: 24 }}
          textAlign={'center'}
          variant={'h5'}
        >
          Co-borrower information
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            variant={'body1'}
          >
            Credit and background checks will apply to the co-borrower as well.
          </Typography>
        </Typography>

        <StyledFormItem gap={3} label={'Is there a co-borrower?'} sub>
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              setIsCoBorrower(value === LoanAnswerEnum.yes);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%' }}
            value={isCoBorrower ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
          />
        </StyledFormItem>

        <Transitions
          style={{
            display: isCoBorrower ? 'block' : 'none',
            width: '100%',
          }}
        >
          {isCoBorrower && (
            <Stack gap={6} mt={3} width={'100%'}>
              <StyledFormItem
                gap={3}
                label={'Personal information'}
                labelSx={{ pb: 3 }}
                sub
              >
                <Stack
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={'First name'}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={'First name'}
                    value={firstName}
                  />
                  <StyledTextField
                    label={'Last name'}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={'Last name'}
                    value={lastName}
                  />
                </Stack>

                <StyledDatePicker
                  disableFuture={false}
                  label={'Date of birth'}
                  onChange={(value) => {
                    setBirthDate(value as Date);
                  }}
                  value={birthDate}
                />

                <Stack
                  flexDirection={{ xs: 'column', lg: 'row' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextFieldPhone
                    label={'Phone number'}
                    onValueChange={({ value }) => setPhoneNumber(value)}
                    placeholder={'Phone number'}
                    value={phoneNumber}
                  />
                  <StyledTextField
                    label={'Email'}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={'Email'}
                    value={email}
                  />
                </Stack>
              </StyledFormItem>

              <StyledFormItem gap={3} label={'Citizenship status'} sub>
                <StyledSelectOption
                  onChange={(value) =>
                    setCitizenship(
                      value as string as DashboardTaskCitizenshipStatus,
                    )
                  }
                  options={OPTIONS_COMMON_CITIZEN_TYPE}
                  value={citizenship}
                />
              </StyledFormItem>

              <StyledFormItem
                gap={3}
                label={'Current address'}
                labelSx={{ pb: 3 }}
                sub
              >
                <StyledGoogleAutoComplete address={address} />
              </StyledFormItem>

              <Transitions
                style={{
                  display:
                    citizenship !==
                    DashboardTaskCitizenshipStatus.foreign_national
                      ? 'flex'
                      : 'none',
                  width: '100%',
                }}
              >
                {citizenship !==
                  DashboardTaskCitizenshipStatus.foreign_national && (
                  <StyledFormItem
                    gap={3}
                    label={'Social security number'}
                    labelSx={{ pb: 3 }}
                    sub
                  >
                    <StyledTextFieldSocialNumber
                      label={'Social security number'}
                      onValueChange={(v) => setSsn(v)}
                      value={ssn}
                    />
                  </StyledFormItem>
                )}
              </Transitions>
            </Stack>
          )}
        </Transitions>

        <Stack
          flexDirection={{ xs: 'unset', md: 'row' }}
          gap={3}
          maxWidth={648}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={async () => {
              await router.push({
                pathname: '/dashboard/tasks',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{ flex: 1, width: '100%' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading || !isFormDataValid}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ flex: 1, width: '100%' }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
