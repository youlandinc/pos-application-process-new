import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelect,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_STATE,
  OPTIONS_TASK_BORROWER_TYPE,
  OPTIONS_TASK_ENTITY_TYPE,
} from '@/constants';

import { Address, IAddress } from '@/models/common/Address';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskCitizenshipStatus,
  DashboardTaskKey,
  HttpError,
} from '@/types';
import { useAsync } from 'react-use';
import { POSGetParamsFromUrl } from '@/utils';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

export const TasksBorrower: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);

  const [borrowerType, setBorrowerType] = useState<DashboardTaskBorrowerType>(
    DashboardTaskBorrowerType.default,
  );
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

  const [signatoryTitle, setSignatoryTitle] = useState('');
  // entity
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState<DashboardTaskBorrowerEntityType>(
    DashboardTaskBorrowerEntityType.default,
  );
  const [entityState, setEntityState] = useState('');
  const [entityId, setEntityId] = useState('');
  // trust
  const [trustName, setTrustName] = useState('');

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
            borrowerType,
            citizenship,
            firstName,
            lastName,
            birthDate,
            phoneNumber,
            email,
            ssn,
            addressInfo,
            entityName,
            entityType,
            entityId,
            entityState,
            signatoryTitle,
            trustName,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.borrower,
      });
      setBorrowerType(borrowerType ?? DashboardTaskBorrowerType.default);
      setCitizenship(citizenship ?? DashboardTaskCitizenshipStatus.default);
      setFirstName(firstName ?? '');
      setLastName(lastName ?? '');
      setBirthDate(birthDate ? new Date(birthDate) : null);
      setPhoneNumber(phoneNumber ?? '');
      setEmail(email ?? '');
      setSsn(ssn ?? '');

      setSignatoryTitle(signatoryTitle ?? '');
      setTrustName(trustName ?? '');

      setEntityName(entityName ?? '');
      setEntityType(entityType ?? DashboardTaskBorrowerEntityType.default);
      setEntityId(entityId ?? '');
      setEntityState(entityState ?? '');

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
    if (!borrowerType) {
      return false;
    }
    const dateCondition = isValid(birthDate) && isDate(birthDate);
    const baseCondition =
      !!citizenship &&
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      !!email &&
      !!ssn &&
      address.isValid &&
      dateCondition;

    if (borrowerType === DashboardTaskBorrowerType.individual) {
      return baseCondition;
    }
    if (borrowerType === DashboardTaskBorrowerType.entity) {
      return (
        baseCondition &&
        !!entityName &&
        !!entityType &&
        !!entityId &&
        !!entityState &&
        !!signatoryTitle
      );
    }
    if (borrowerType === DashboardTaskBorrowerType.trust) {
      return baseCondition && !!trustName && !!signatoryTitle;
    }
  }, [
    address.isValid,
    birthDate,
    borrowerType,
    citizenship,
    email,
    entityId,
    entityName,
    entityState,
    entityType,
    firstName,
    lastName,
    phoneNumber,
    signatoryTitle,
    ssn,
    trustName,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.borrower,
      data: {
        borrowerType,
        citizenship,
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

        signatoryTitle,
        trustName,

        entityName,
        entityType,
        entityId,
        entityState,
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
        gap={6}
        justifyContent={'flex-start'}
        maxWidth={600}
        mx={'auto'}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography color={'text.primary'} textAlign={'center'} variant={'h4'}>
          Borrower information
          <Typography color={'text.secondary'} mt={1.5} variant={'body1'}>
            Please enter your personal details below so we may begin processing
            your loan documents.
          </Typography>
        </Typography>

        <StyledFormItem
          gap={3}
          label={'Borrower type'}
          labelSx={{ textAlign: 'left', m: 0 }}
          sub
        >
          <StyledSelectOption
            onChange={(value) => {
              setBorrowerType(value as string as DashboardTaskBorrowerType);
            }}
            options={OPTIONS_TASK_BORROWER_TYPE}
            value={borrowerType}
          />
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
            <StyledFormItem
              gap={3}
              label={'Entity information'}
              labelSx={{ textAlign: 'left', m: 0 }}
              sub
            >
              <StyledTextField
                label={'Entity name'}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder={'Entity name'}
                value={entityName}
              />
              <StyledSelect
                label={'Entity type'}
                onChange={(e) => {
                  setEntityType(
                    e.target.value as string as DashboardTaskBorrowerEntityType,
                  );
                }}
                options={OPTIONS_TASK_ENTITY_TYPE}
                value={entityType}
              />
              <StyledTextField
                label={'Secretary of State ID'}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder={'Secretary of State ID'}
                value={entityId}
              />
              <StyledSelect
                label={'Formation State'}
                onChange={(e) => setEntityState(e.target.value as string)}
                options={OPTIONS_COMMON_STATE}
                value={entityState}
              />
            </StyledFormItem>
          )}
        </Transitions>

        <Transitions
          style={{
            display:
              borrowerType === DashboardTaskBorrowerType.trust
                ? 'flex'
                : 'none',
            width: '100%',
          }}
        >
          {borrowerType === DashboardTaskBorrowerType.trust && (
            <StyledFormItem
              gap={3}
              label={'Trust information'}
              labelSx={{ textAlign: 'left', m: 0 }}
              sub
            >
              <StyledTextField
                label={'Trust name'}
                onChange={(e) => setTrustName(e.target.value)}
                placeholder={'Trust name'}
                value={trustName}
              />
            </StyledFormItem>
          )}
        </Transitions>

        <StyledFormItem
          gap={3}
          label={
            borrowerType === DashboardTaskBorrowerType.individual ||
            borrowerType === DashboardTaskBorrowerType.default
              ? 'Personal information'
              : 'Authorized signatory information'
          }
          labelSx={{ textAlign: 'left', m: 0 }}
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

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            width={'100%'}
          >
            {(borrowerType === DashboardTaskBorrowerType.trust ||
              borrowerType === DashboardTaskBorrowerType.entity) && (
              <StyledTextField
                label={'Authorized signatory title'}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                placeholder={'Authorized signatory title'}
                value={signatoryTitle}
              />
            )}

            <StyledDatePicker
              disableFuture={false}
              label={'Date of birth'}
              onChange={(value) => {
                setBirthDate(value as Date);
              }}
              value={birthDate}
            />
          </Stack>

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

        <StyledFormItem
          gap={3}
          label={'Citizenship status'}
          labelSx={{ textAlign: 'left', m: 0 }}
          sub
        >
          <StyledSelectOption
            onChange={(value) =>
              setCitizenship(value as string as DashboardTaskCitizenshipStatus)
            }
            options={OPTIONS_COMMON_CITIZEN_TYPE}
            value={citizenship}
          />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Current address'}
          labelSx={{ textAlign: 'left', m: 0 }}
          sub
        >
          <StyledGoogleAutoComplete address={address} />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Social security number'}
          labelSx={{ textAlign: 'left', m: 0 }}
          sub
        >
          <StyledTextFieldSocialNumber
            label={'Social security number'}
            onValueChange={(v) => setSsn(v)}
            value={ssn}
          />
        </StyledFormItem>

        <Stack
          flexDirection={{ xs: 'unset', md: 'row' }}
          gap={3}
          maxWidth={600}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={() => {
              router.push({
                pathname: '/dashboard/tasks',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading || !isFormDataValid}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
