import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { Address, IAddress } from '@/models/common/Address';

import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';
import {
  AddressSchema,
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_YES_OR_NO,
  TaskCoBorrowerSchema,
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
import { TasksRightMenu } from '@/components/molecules';

import {
  DashboardTaskKey,
  HttpError,
  LoanAnswerEnum,
  LoanCitizenshipEnum,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksCoBorrower: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const breakpoints = useBreakpoints();

  const [saveLoading, setSaveLoading] = useState(false);

  const [addressError, setAddressError] = useState<
    Record<string, string[]> | undefined
  >();
  const [formMessage, setFormError] = useState<
    Record<string, string[]> | undefined
  >();

  const [isCoBorrower, setIsCoBorrower] = useState<boolean>(false);

  const [citizenship, setCitizenship] = useState<LoanCitizenshipEnum>(
    LoanCitizenshipEnum.default,
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

      setCitizenship(citizenship ?? LoanCitizenshipEnum.us_citizen);

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

    if (isCoBorrower) {
      const validateForm = await validate(postData.data, TaskCoBorrowerSchema);
      const validateAddress = await validate(
        address.getPostData(),
        AddressSchema,
      );
      if (validateForm || validateAddress) {
        setFormError(validateForm);
        setAddressError(validateAddress);
        return;
      }
    }

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.co_borrower);
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
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Stack
          gap={{ xs: 6, lg: 8 }}
          justifyContent={'flex-start'}
          maxWidth={900}
          width={'100%'}
        >
          <Typography fontSize={{ xs: 20, lg: 24 }}>
            Co-borrower information
            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              mt={1}
              variant={'body1'}
            >
              Credit and background checks will apply to the co-borrower as
              well.
            </Typography>
          </Typography>

          <StyledFormItem
            gap={3}
            label={'Is there a co-borrower?'}
            maxWidth={600}
            mt={-3}
            sub
          >
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
              <Stack gap={{ xs: 6, lg: 8 }} maxWidth={600} width={'100%'}>
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
                      onChange={(e) => {
                        if (formMessage?.firstName) {
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
                      validate={formMessage?.firstName}
                      value={firstName}
                    />
                    <StyledTextField
                      label={'Last name'}
                      onChange={(e) => {
                        if (formMessage?.lastName) {
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
                      validate={formMessage?.lastName}
                      value={lastName}
                    />
                  </Stack>

                  <StyledDatePicker
                    disableFuture={false}
                    label={'Date of birth'}
                    onChange={(value) => {
                      if (formMessage?.birthDate) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.birthDate;
                          }
                          return prev;
                        });
                      }
                      setBirthDate(value as Date);
                    }}
                    validate={formMessage?.birthDate}
                    value={birthDate}
                  />

                  <Stack
                    flexDirection={{ xs: 'column', lg: 'row' }}
                    gap={3}
                    width={'100%'}
                  >
                    <StyledTextFieldPhone
                      label={'Phone number'}
                      onValueChange={({ value }) => {
                        if (formMessage?.phoneNumber) {
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
                      validate={formMessage?.phoneNumber}
                      value={phoneNumber}
                    />
                    <StyledTextField
                      label={'Email'}
                      onChange={(e) => {
                        if (formMessage?.email) {
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
                      validate={formMessage?.email}
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
                    value={citizenship}
                  />
                </StyledFormItem>

                <StyledFormItem
                  gap={3}
                  label={'Current address'}
                  labelSx={{ pb: 3 }}
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
                    <StyledFormItem
                      gap={3}
                      label={'Social security number'}
                      labelSx={{ pb: 3 }}
                      sub
                    >
                      <StyledTextFieldSocialNumber
                        label={'Social security number'}
                        onValueChange={(v) => {
                          if (formMessage?.ssn) {
                            setFormError((prev) => {
                              if (prev) {
                                delete prev.ssn;
                              }
                              return prev;
                            });
                          }
                          setSsn(v);
                        }}
                        validate={formMessage?.ssn}
                        value={ssn}
                      />
                    </StyledFormItem>
                  )}
                </Transitions>
              </Stack>
            )}
          </Transitions>

          <StyledButton
            color={'primary'}
            disabled={saveLoading}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ width: 200 }}
          >
            Save and continue
          </StyledButton>
        </Stack>

        {['lg', 'xl', 'xxl'].includes(breakpoints) && <TasksRightMenu />}
      </Stack>
    </Fade>
  );
});

//const isFormDataValid = useMemo(() => {
//  if (!isCoBorrower) {
//    return true;
//  }
//
//  const dateCondition = isValid(birthDate) && isDate(birthDate);
//  const baseCondition =
//      !!firstName &&
//      !!lastName &&
//      !!phoneNumber &&
//      !!email &&
//      address.isValid &&
//      dateCondition;
//
//  if (!citizenship) {
//    return false;
//  }
//  if (citizenship === LoanCitizenshipEnum.foreign_national) {
//    return baseCondition;
//  }
//  return baseCondition && !!ssn;
//}, [
//  address.isValid,
//  birthDate,
//  citizenship,
//  email,
//  firstName,
//  isCoBorrower,
//  lastName,
//  phoneNumber,
//  ssn,
//]);
