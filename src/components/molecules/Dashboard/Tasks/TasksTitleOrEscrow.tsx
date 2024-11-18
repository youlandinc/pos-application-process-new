import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { Address, IAddress, SAddress } from '@/models/common/Address';

import { POSGetParamsFromUrl, POSNotUndefined } from '@/utils';
import { useSessionStorageState } from '@/hooks';
import {
  AddressSchema,
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_INSTRUCTIONS,
  OPTIONS_TASK_MANAGING_LOAN_CLOSING,
  TaskTitleOrEscrowSchema,
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
  StyledTextFieldNumber,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

import {
  DashboardTaskInstructions,
  DashboardTaskKey,
  DashboardTaskLoanClosing,
  HttpError,
  LoanAnswerEnum,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

const initialValues: {
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  titleOrderNumber: string;
  contractDate?: null | unknown | Date;
} = {
  firstName: '',
  lastName: '',
  companyName: '',
  phoneNumber: '',
  email: '',
  titleOrderNumber: '',
  contractDate: null,
};

const initialAddress: SAddress = {
  formatAddress: '',
  state: '',
  street: '',
  city: '',
  aptNumber: '',
  postcode: '',
  isValid: false,
  errors: {},
  lng: 0,
  lat: 0,
};

const resetAddress = {
  address: '',
  aptNumber: '',
  city: '',
  state: '',
  postcode: '',
};

export const TasksTitleOrEscrow: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const { saasState } = useSessionStorageState('tenantConfig');

  const [saveLoading, setSaveLoading] = useState(false);

  const [addressError, setAddressError] = useState<
    { [key: string]: Record<string, string[]> & string[] } | undefined
  >();
  const [formError, setFormError] = useState<
    { [key: string]: Record<string, string[]> & string[] } | undefined
  >();

  const [contactForm, setContactForm] = useState(initialValues);
  const [manageForm, setManageForm] = useState(initialValues);

  const [clientContactAddress] = useState<IAddress>(
    Address.create(initialAddress),
  );
  const [clientManageAddress] = useState<IAddress>(
    Address.create(initialAddress),
  );

  const [isLoanClosing, setIsLoanClosing] = useState<boolean | undefined>();
  const [escrowNumber, setEscrowNumber] = useState<undefined | number>();
  const [instructions, setInstructions] = useState<DashboardTaskInstructions>(
    DashboardTaskInstructions.title_officer,
  );
  const [whoIsManaging, setWhoIsManaging] = useState<DashboardTaskLoanClosing>(
    DashboardTaskLoanClosing.escrow_company,
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
            contactForm,
            contactAddress,

            manageForm,
            manageAddress,

            isLoanClosing,
            whoIsManaging,

            escrowNumber,
            instructions,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.title_escrow,
      });

      setContactForm({
        ...contactForm,
        contractDate: contactForm.contractDate
          ? new Date(contactForm.contractDate)
          : null,
      });
      setManageForm(manageForm);

      setIsLoanClosing(isLoanClosing ?? true);
      setEscrowNumber(escrowNumber || undefined);
      setInstructions(instructions ?? DashboardTaskInstructions.title_officer);
      setWhoIsManaging(
        whoIsManaging ?? DashboardTaskLoanClosing.escrow_company,
      );

      clientContactAddress.injectServerData(contactAddress ?? resetAddress);
      clientManageAddress.injectServerData(manageAddress ?? resetAddress);
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
    const dateValid = (date: any) => {
      return isValid(date) && isDate(date);
    };

    const data = isLoanClosing
      ? {
          contactForm: {
            ...contactForm,
            contractDate: dateValid(contactForm.contractDate)
              ? format(contactForm.contractDate as Date, 'yyyy-MM-dd')
              : null,
          },
          contactAddress: clientContactAddress.getPostData(),
          manageForm: initialValues,
          manageAddress: resetAddress,
          isLoanClosing,
          whoIsManaging: undefined,
          escrowNumber,
          instructions,
        }
      : {
          contactForm: {
            ...contactForm,
            contractDate: dateValid(contactForm.contractDate)
              ? format(contactForm.contractDate as Date, 'yyyy-MM-dd')
              : null,
          },
          contactAddress: clientContactAddress.getPostData(),
          manageForm,
          manageAddress: clientManageAddress.getPostData(),
          isLoanClosing,
          whoIsManaging,
          escrowNumber: undefined,
          instructions,
        };

    const postData = {
      loanId: router.query.loanId as string,
      taskKey: DashboardTaskKey.title_escrow,
      data,
    };

    const validateContactForm = await validate(
      postData.data.contactForm,
      TaskTitleOrEscrowSchema.contractFrom,
    );
    const validateContactAddress = await validate(
      clientContactAddress.getPostData(),
      AddressSchema,
    );
    const validateManageForm = await validate(
      postData.data.manageForm,
      TaskTitleOrEscrowSchema.manageForm,
    );
    const validateManageAddress = await validate(
      clientManageAddress.getPostData(),
      AddressSchema,
    );

    const resultFormError = {};

    const resultAddressError = {};

    validateContactForm &&
      Object.assign(resultFormError, { contactForm: validateContactForm });

    validateContactAddress &&
      Object.assign(resultAddressError, {
        contactAddress: validateContactAddress,
      });

    if (!isLoanClosing) {
      validateManageForm &&
        Object.assign(resultFormError, { manageForm: validateManageForm });
      validateManageAddress &&
        Object.assign(resultAddressError, {
          manageAddress: validateManageAddress,
        });
    } else {
      !POSNotUndefined(escrowNumber) &&
        Object.assign(resultFormError, { escrowNumber: ['Cannot be empty'] });
    }

    if (
      Object.keys(resultFormError).length > 0 ||
      Object.keys(resultAddressError).length > 0
    ) {
      setFormError(resultFormError);
      setAddressError(resultAddressError);
      return;
    }

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.title_escrow);
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
          Title company (optional)
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            sx={{ display: 'flex', flexDirection: 'column' }}
            variant={'body1'}
          >
            A closing agent assists with closing and verifies there are no
            outstanding title issues.
            <Typography component={'span'}>
              {saasState?.organizationName || 'YouLand'} also orders a Title
              Commitment and a Title Report on the property from this agent.
            </Typography>
          </Typography>
        </Typography>

        <StyledFormItem
          gap={3}
          label={'Provide contact details for the title company'}
          labelSx={{ pb: 3 }}
          maxWidth={600}
          mt={-3}
          sub
        >
          <StyledTextField
            label={'Company name'}
            onChange={(e) => {
              if (formError?.contactForm?.companyName) {
                setFormError((prev) => {
                  if (prev) {
                    delete prev.contactForm.companyName;
                  }
                  return prev;
                });
              }
              setContactForm({
                ...contactForm,
                companyName: e.target.value,
              });
            }}
            validate={formError?.contactForm?.companyName}
            value={contactForm.companyName}
          />
          <StyledTextField
            label={'Title order number'}
            onChange={(e) => {
              if (formError?.contactForm?.titleOrderNumber) {
                setFormError((prev) => {
                  if (prev) {
                    delete prev.contactForm.titleOrderNumber;
                  }
                  return prev;
                });
              }
              setContactForm({
                ...contactForm,
                titleOrderNumber: e.target.value,
              });
            }}
            validate={formError?.contactForm?.titleOrderNumber}
            value={contactForm.titleOrderNumber}
          />
          <StyledDatePicker
            label={'Title effective date'}
            onChange={(date) => {
              if (formError?.contactForm?.contractDate) {
                setFormError((prev) => {
                  if (prev) {
                    delete prev.contactForm.contractDate;
                  }
                  return prev;
                });
              }
              setContactForm({ ...contactForm, contractDate: date });
            }}
            validate={formError?.contactForm?.contractDate}
            value={contactForm.contractDate}
          />
          <StyledGoogleAutoComplete
            address={clientContactAddress}
            addressError={addressError?.contactAddress}
            label={'Company address'}
          />
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={
            'Who is signing the closing instructions on behalf of the title company?'
          }
          sub
        >
          <StyledSelectOption
            onChange={(value) =>
              setInstructions(value as string as DashboardTaskInstructions)
            }
            options={OPTIONS_TASK_INSTRUCTIONS}
            sx={{ maxWidth: 600 }}
            value={instructions}
          />

          <Transitions
            style={{
              maxWidth: 600,
              width: '100%',
              display:
                POSNotUndefined(instructions) && instructions ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {POSNotUndefined(instructions) && instructions && (
              <>
                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={"Signee's first name"}
                    onChange={(e) => {
                      if (formError?.contactForm?.firstName) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.contactForm.firstName;
                          }
                          return prev;
                        });
                      }
                      setContactForm({
                        ...contactForm,
                        firstName: e.target.value,
                      });
                    }}
                    validate={formError?.contactForm?.firstName}
                    value={contactForm.firstName}
                  />
                  <StyledTextField
                    label={"Signee's last name"}
                    onChange={(e) => {
                      if (formError?.contactForm?.lastName) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.contactForm.lastName;
                          }
                          return prev;
                        });
                      }
                      setContactForm({
                        ...contactForm,
                        lastName: e.target.value,
                      });
                    }}
                    validate={formError?.contactForm?.lastName}
                    value={contactForm.lastName}
                  />
                </Stack>

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  mt={3}
                  width={'100%'}
                >
                  <StyledTextFieldPhone
                    label={"Signee's phone number"}
                    onValueChange={({ value }) => {
                      if (formError?.contactForm?.phoneNumber) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.contactForm.phoneNumber;
                          }
                          return prev;
                        });
                      }
                      setContactForm({
                        ...contactForm,
                        phoneNumber: value,
                      });
                    }}
                    validate={formError?.contactForm?.phoneNumber}
                    value={contactForm.phoneNumber}
                  />
                  <StyledTextField
                    label={"Signee's email address"}
                    onChange={(e) => {
                      if (formError?.contactForm?.email) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.contactForm.email;
                          }
                          return prev;
                        });
                      }
                      setContactForm({
                        ...contactForm,
                        email: e.target.value,
                      });
                    }}
                    validate={formError?.contactForm?.email}
                    value={contactForm.email}
                  />
                </Stack>
              </>
            )}
          </Transitions>
        </StyledFormItem>

        <StyledFormItem
          gap={3}
          label={'Is the title company also managing loan closing?'}
          maxWidth={600}
          sub
        >
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              setFormError((prev) => {
                if (prev?.manageForm) {
                  delete prev.manageForm;
                }
                if (prev?.escrowNumber) {
                  delete prev.escrowNumber;
                }
                return prev;
              });
              setAddressError((prev) => {
                if (prev?.manageAddress) {
                  delete prev.manageAddress;
                }
                return prev;
              });

              setIsLoanClosing(value === LoanAnswerEnum.yes);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={isLoanClosing ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
          />
        </StyledFormItem>

        <Transitions
          style={{
            maxWidth: 600,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {POSNotUndefined(isLoanClosing) ? (
            !isLoanClosing ? (
              <StyledFormItem
                gap={3}
                label={'Who is managing loan closing?'}
                sub
                width={'100%'}
              >
                <StyledSelectOption
                  onChange={(value) =>
                    setWhoIsManaging(
                      value as string as DashboardTaskLoanClosing,
                    )
                  }
                  options={OPTIONS_TASK_MANAGING_LOAN_CLOSING}
                  value={whoIsManaging}
                />

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={'Contact first name'}
                    onChange={(e) => {
                      if (formError?.manageForm?.firstName) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.firstName;
                          }
                          return prev;
                        });
                      }
                      setManageForm({
                        ...manageForm,
                        firstName: e.target.value,
                      });
                    }}
                    validate={formError?.manageForm?.firstName}
                    value={manageForm.firstName}
                  />
                  <StyledTextField
                    label={'Contact last name'}
                    onChange={(e) => {
                      if (formError?.manageForm?.lastName) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.lastName;
                          }
                          return prev;
                        });
                      }
                      setManageForm({
                        ...manageForm,
                        lastName: e.target.value,
                      });
                    }}
                    validate={formError?.manageForm?.lastName}
                    value={manageForm.lastName}
                  />
                </Stack>

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextFieldPhone
                    label={'Phone number'}
                    onValueChange={({ value }) => {
                      if (formError?.manageForm?.phoneNumber) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.phoneNumber;
                          }
                          return prev;
                        });
                      }
                      setManageForm({ ...manageForm, phoneNumber: value });
                    }}
                    validate={formError?.manageForm?.phoneNumber}
                    value={manageForm.phoneNumber}
                  />
                  <StyledTextField
                    label={'Email'}
                    onChange={(e) => {
                      if (formError?.manageForm?.email) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.email;
                          }
                          return prev;
                        });
                      }
                      setManageForm({
                        ...manageForm,
                        email: e.target.value,
                      });
                    }}
                    validate={formError?.manageForm?.email}
                    value={manageForm.email}
                  />
                </Stack>

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={'Company name'}
                    onChange={(e) => {
                      if (formError?.manageForm?.companyName) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.companyName;
                          }
                          return prev;
                        });
                      }
                      setManageForm({
                        ...manageForm,
                        companyName: e.target.value,
                      });
                    }}
                    validate={formError?.manageForm?.companyName}
                    value={manageForm.companyName}
                  />
                  <StyledTextField
                    label={
                      whoIsManaging === DashboardTaskLoanClosing.escrow_company
                        ? 'Escrow number'
                        : 'Closing attorney file No.'
                    }
                    onChange={(e) => {
                      if (formError?.manageForm?.titleOrderNumber) {
                        setFormError((prev) => {
                          if (prev) {
                            delete prev.manageForm.titleOrderNumber;
                          }
                          return prev;
                        });
                      }
                      setManageForm({
                        ...manageForm,
                        titleOrderNumber: e.target.value,
                      });
                    }}
                    validate={formError?.manageForm?.titleOrderNumber}
                    value={manageForm.titleOrderNumber}
                  />
                </Stack>

                <StyledGoogleAutoComplete
                  address={clientManageAddress}
                  addressError={addressError?.manageAddress}
                  label={'Company address'}
                />
              </StyledFormItem>
            ) : (
              <Stack mt={{ xs: -3, lg: -5 }} width={'100%'}>
                <StyledTextFieldNumber
                  decimalScale={0}
                  label={'Escrow number'}
                  onValueChange={({ floatValue }) => {
                    if (formError?.escrowNumber) {
                      setFormError((prev) => {
                        if (prev) {
                          delete prev.escrowNumber;
                        }
                        return prev;
                      });
                    }
                    setEscrowNumber(floatValue);
                  }}
                  thousandSeparator={false}
                  validate={formError?.escrowNumber}
                  value={escrowNumber}
                />
              </Stack>
            )
          ) : null}
        </Transitions>

        <StyledButton
          color={'primary'}
          disabled={saveLoading}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 276 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});

//const isFormDataValid = useMemo(() => {
//  const dateValid = (date: any) => {
//    return isValid(date) && isDate(date);
//  };
//
//  const conditionA = () => {
//    return (
//        !!contactForm.firstName &&
//        !!contactForm.lastName &&
//        !!contactForm.email &&
//        !!contactForm.phoneNumber &&
//        !!contactForm.companyName &&
//        !!contactForm.titleOrderNumber &&
//        dateValid(contactForm.contractDate) &&
//        clientContactAddress.checkAddressValid
//    );
//  };
//  const conditionB = () => {
//    return (
//        !!manageForm.firstName &&
//        !!manageForm.lastName &&
//        !!manageForm.email &&
//        !!manageForm.phoneNumber &&
//        !!manageForm.companyName &&
//        !!manageForm.titleOrderNumber &&
//        clientManageAddress.checkAddressValid
//    );
//  };
//  if (!POSNotUndefined(isLoanClosing)) {
//    return false;
//  }
//  return isLoanClosing
//      ? conditionA() && !!instructions && !!escrowNumber
//      : conditionA() && conditionB() && !!whoIsManaging && !!instructions;
//}, [
//  clientContactAddress.checkAddressValid,
//  contactForm.companyName,
//  contactForm.contractDate,
//  contactForm.email,
//  contactForm.firstName,
//  contactForm.lastName,
//  contactForm.phoneNumber,
//  contactForm.titleOrderNumber,
//  escrowNumber,
//  instructions,
//  isLoanClosing,
//  clientManageAddress.checkAddressValid,
//  manageForm.companyName,
//  manageForm.email,
//  manageForm.firstName,
//  manageForm.lastName,
//  manageForm.phoneNumber,
//  manageForm.titleOrderNumber,
//  whoIsManaging,
//]);
