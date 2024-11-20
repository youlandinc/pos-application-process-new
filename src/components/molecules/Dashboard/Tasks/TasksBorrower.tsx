import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { Address, IAddress } from '@/models/common/Address';

import { POSGetParamsFromUrl } from '@/utils';
import {
  AddressSchema,
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_STATE,
  OPTIONS_TASK_BORROWER_TYPE,
  OPTIONS_TASK_ENTITY_TYPE,
  TaskBorrowerSchema,
} from '@/constants';

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
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
  DashboardTaskKey,
  HttpError,
  LoanCitizenshipEnum,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksBorrower: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const [saveLoading, setSaveLoading] = useState(false);

  const [addressError, setAddressError] = useState<
    Record<string, string[]> | undefined
  >();
  const [formError, setFormError] = useState<
    Record<string, string[]> | undefined
  >();

  const [borrowerType, setBorrowerType] = useState<DashboardTaskBorrowerType>(
    DashboardTaskBorrowerType.default,
  );
  const [citizenship, setCitizenship] = useState<LoanCitizenshipEnum>(
    LoanCitizenshipEnum.default,
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
      setBorrowerType(borrowerType ?? DashboardTaskBorrowerType.individual);
      setCitizenship(citizenship ?? LoanCitizenshipEnum.us_citizen);
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

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.borrower,
      data: {
        borrowerType: borrowerType || undefined,
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

        signatoryTitle,
        trustName,

        entityName,
        entityType: entityType || undefined,
        entityId,
        entityState,
      },
    };

    const validateForm = await validate(postData.data, TaskBorrowerSchema);
    const validateAddress = await validate(
      address.getPostData(),
      AddressSchema,
    );
    if (validateForm || validateAddress) {
      setFormError(validateForm);
      setAddressError(validateAddress);
      return;
    }

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.borrower);
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
      minHeight={'calc(667px - 194px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 6, lg: 8 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        width={'100%'}
      >
        <Typography fontSize={{ xs: 20, lg: 24 }}>
          Borrower information
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            variant={'body1'}
          >
            Please enter the borrower&apos;s details below so we may begin
            processing your loan documents.
          </Typography>
        </Typography>

        <StyledFormItem gap={3} label={'Borrower type'} mt={-3} sub>
          <StyledSelectOption
            onChange={(value) => {
              setBorrowerType(value as string as DashboardTaskBorrowerType);
            }}
            options={OPTIONS_TASK_BORROWER_TYPE}
            sx={{ maxWidth: 600 }}
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
            <StyledFormItem gap={3} label={'Entity information'} sub>
              <StyledTextField
                label={'Entity name'}
                onChange={(e) => {
                  if (formError?.entityName) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.entityName;
                      }
                      return prev;
                    });
                  }
                  setEntityName(e.target.value);
                }}
                placeholder={'Entity name'}
                sx={{ maxWidth: 600 }}
                validate={formError?.entityName}
                value={entityName}
              />
              <StyledSelect
                label={'Entity type'}
                onChange={(e) => {
                  if (formError?.entityType) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.entityType;
                      }
                      return prev;
                    });
                  }
                  setEntityType(
                    e.target.value as string as DashboardTaskBorrowerEntityType,
                  );
                }}
                options={OPTIONS_TASK_ENTITY_TYPE}
                sx={{ maxWidth: 600 }}
                validate={formError?.entityType}
                value={entityType}
              />
              <StyledTextField
                label={'Secretary of State ID'}
                onChange={(e) => {
                  if (formError?.entityId) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.entityId;
                      }
                      return prev;
                    });
                  }
                  setEntityId(e.target.value);
                }}
                placeholder={'Secretary of State ID'}
                sx={{ maxWidth: 600 }}
                validate={formError?.entityId}
                value={entityId}
              />
              <StyledSelect
                label={'Formation State'}
                onChange={(e) => {
                  if (formError?.entityState) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.entityState;
                      }
                      return prev;
                    });
                  }
                  setEntityState(e.target.value as string);
                }}
                options={OPTIONS_COMMON_STATE}
                sx={{ maxWidth: 600 }}
                validate={formError?.entityState}
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
            <StyledFormItem gap={3} label={'Trust information'} sub>
              <StyledTextField
                label={'Trust name'}
                onChange={(e) => {
                  if (formError?.trustName) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.trustName;
                      }
                      return prev;
                    });
                  }
                  setTrustName(e.target.value);
                }}
                placeholder={'Trust name'}
                sx={{ maxWidth: 600 }}
                validate={formError?.trustName}
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
          labelSx={{ pb: 3 }}
          sub
        >
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextField
              label={'First name'}
              onChange={(e) => {
                if (formError?.firstName) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.firstName;
                    }
                    return prev;
                  });
                }
                setFirstName(e.target.value);
              }}
              placeholder={'First name'}
              validate={formError?.firstName}
              value={firstName}
            />
            <StyledTextField
              label={'Last name'}
              onChange={(e) => {
                if (formError?.lastName) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.lastName;
                    }
                    return prev;
                  });
                }
                setLastName(e.target.value);
              }}
              placeholder={'Last name'}
              validate={formError?.lastName}
              value={lastName}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            {(borrowerType === DashboardTaskBorrowerType.trust ||
              borrowerType === DashboardTaskBorrowerType.entity) && (
              <StyledTextField
                label={'Authorized signatory title'}
                onChange={(e) => {
                  if (formError?.signatoryTitle) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.signatoryTitle;
                      }
                      return prev;
                    });
                  }
                  setSignatoryTitle(e.target.value);
                }}
                placeholder={'Authorized signatory title'}
                validate={formError?.signatoryTitle}
                value={signatoryTitle}
              />
            )}

            <StyledDatePicker
              disableFuture={true}
              label={'Date of birth'}
              onChange={(value) => {
                if (formError?.birthDate) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.birthDate;
                    }
                    return prev;
                  });
                }
                setBirthDate(value as Date);
              }}
              validate={formError?.birthDate}
              value={birthDate}
            />
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextFieldPhone
              label={'Phone number'}
              onValueChange={({ value }) => {
                if (formError?.phoneNumber) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.phoneNumber;
                    }
                    return prev;
                  });
                }
                setPhoneNumber(value);
              }}
              placeholder={'Phone number'}
              validate={formError?.phoneNumber}
              value={phoneNumber}
            />
            <StyledTextField
              label={'Email'}
              onChange={(e) => {
                if (formError?.email) {
                  setFormError((prev) => {
                    if (prev) {
                      delete prev.email;
                    }
                    return prev;
                  });
                }
                setEmail(e.target.value);
              }}
              placeholder={'Email'}
              validate={formError?.email}
              value={email}
            />
          </Stack>
        </StyledFormItem>

        <StyledFormItem gap={3} label={'Citizenship status'} sub>
          <StyledSelectOption
            onChange={(value) =>
              setCitizenship(value as string as LoanCitizenshipEnum)
            }
            options={OPTIONS_COMMON_CITIZEN_TYPE}
            sx={{ maxWidth: 600 }}
            value={citizenship}
          />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Current address'}
          labelSx={{ pb: 3 }}
          maxWidth={600}
          sub
        >
          <StyledGoogleAutoComplete
            address={address}
            addressError={addressError}
          />
        </StyledFormItem>

        <Transitions
          style={{
            display:
              citizenship !== LoanCitizenshipEnum.foreign_national
                ? 'flex'
                : 'none',
            width: '100%',
          }}
        >
          {citizenship !== LoanCitizenshipEnum.foreign_national && (
            <StyledFormItem gap={3} label={'Social security number'} sub>
              <StyledTextFieldSocialNumber
                label={'Social security number'}
                onValueChange={(v) => {
                  if (formError?.ssn) {
                    setFormError((prev) => {
                      if (prev) {
                        delete prev.ssn;
                      }
                      return prev;
                    });
                  }
                  setSsn(v);
                }}
                sx={{ maxWidth: 600 }}
                validate={formError?.ssn}
                value={ssn}
              />
            </StyledFormItem>
          )}
        </Transitions>

        <StyledButton
          color={'primary'}
          disabled={saveLoading}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 276, mb: 8 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});

//const isFormDataValid = useMemo(() => {
//  if (!borrowerType) {
//    return false;
//  }
//  const dateCondition = isValid(birthDate) && isDate(birthDate);
//  const baseCondition =
//      !!firstName &&
//      !!lastName &&
//      !!phoneNumber &&
//      !!email &&
//      address.isValid &&
//      dateCondition;
//
//  if (borrowerType === DashboardTaskBorrowerType.individual) {
//    if (!citizenship) {
//      return false;
//    }
//    if (citizenship === LoanCitizenshipEnum.foreign_national) {
//      return baseCondition;
//    }
//    return baseCondition && !!ssn;
//  }
//  if (borrowerType === DashboardTaskBorrowerType.entity) {
//    if (!citizenship) {
//      return false;
//    }
//    if (citizenship === LoanCitizenshipEnum.foreign_national) {
//      return (
//          baseCondition &&
//          !!entityName &&
//          !!entityType &&
//          !!entityId &&
//          !!entityState &&
//          !!signatoryTitle
//      );
//    }
//    return (
//        baseCondition &&
//        !!entityName &&
//        !!entityType &&
//        !!entityId &&
//        !!entityState &&
//        !!signatoryTitle &&
//        !!ssn
//    );
//  }
//  if (borrowerType === DashboardTaskBorrowerType.trust) {
//    if (!citizenship) {
//      return false;
//    }
//    if (citizenship === LoanCitizenshipEnum.foreign_national) {
//      return baseCondition && !!trustName && !!signatoryTitle;
//    }
//    return baseCondition && !!trustName && !!signatoryTitle && !!ssn;
//  }
//}, [
//  address.isValid,
//  birthDate,
//  borrowerType,
//  citizenship,
//  email,
//  entityId,
//  entityName,
//  entityState,
//  entityType,
//  firstName,
//  lastName,
//  phoneNumber,
//  signatoryTitle,
//  ssn,
//  trustName,
//]);
