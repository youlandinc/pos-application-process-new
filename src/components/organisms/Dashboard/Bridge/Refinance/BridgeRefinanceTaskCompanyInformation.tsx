import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';

import { POSNotUndefined } from '@/utils';
import { DashboardTaskInstructions, DashboardTaskLoanClosing } from '@/types';
import { Address, IAddress, SAddress } from '@/models/common/Address';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_INSTRUCTIONS,
  OPTIONS_TASK_MANAGING_LOAN_CLOSING,
} from '@/constants';
import {
  _fetchTaskFormInfo,
  _skipLoanTask,
  _updateTaskFormInfo,
} from '@/requests/dashboard';

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
import { useSessionStorageState } from '@/hooks';

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
};

const resetAddress = {
  address: '',
  aptNumber: '',
  city: '',
  state: '',
  postcode: '',
};

export const BridgeRefinanceTaskCompanyInformation: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [saveLoading, setSaveLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

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
  const [instructions, setInstructions] = useState<
    DashboardTaskInstructions | undefined
  >();
  const [whoIsManaging, setWhoIsManaging] = useState<
    DashboardTaskLoanClosing | undefined
  >();

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
          contactForm,
          contactAddress,

          manageForm,
          manageAddress,

          isLoanClosing,
          whoIsManaging,

          escrowNumber,
          instructions,
        } = res.data;

        setContactForm({
          ...contactForm,
          contractDate: contactForm.contractDate
            ? new Date(contactForm.contractDate)
            : null,
        });
        setManageForm(manageForm);

        setIsLoanClosing(isLoanClosing ?? undefined);
        setEscrowNumber(escrowNumber ?? undefined);
        setInstructions(instructions ?? '');
        setWhoIsManaging(whoIsManaging ?? '');

        setTimeout(() => {
          clientContactAddress.injectServerData(contactAddress ?? resetAddress);
          clientManageAddress.injectServerData(manageAddress ?? resetAddress);
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

  const handledSubmit = useCallback(async () => {
    const dateValid = (date: any) => {
      return isValid(date) && isDate(date);
    };

    setSaveLoading(true);
    const taskForm = isLoanClosing
      ? {
          contactForm: {
            ...contactForm,
            contractDate: dateValid(contactForm.contractDate)
              ? format(contactForm.contractDate as Date, 'yyyy-MM-dd O')
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
              ? format(contactForm.contractDate as Date, 'yyyy-MM-dd O')
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
      taskId: router.query.taskId as string,
      taskForm,
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
  }, [
    clientContactAddress,
    clientManageAddress,
    contactForm,
    enqueueSnackbar,
    escrowNumber,
    instructions,
    isLoanClosing,
    manageForm,
    router,
    whoIsManaging,
  ]);

  const handledSkip = useCallback(async () => {
    setSkipLoading(true);
    try {
      await _skipLoanTask(router.query.taskId as string);
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
      setSkipLoading(false);
    }
  }, [enqueueSnackbar, router]);

  const isDisabled = useMemo(() => {
    const dateValid = (date: any) => {
      return isValid(date) && isDate(date);
    };

    const conditionA = () => {
      return (
        !!contactForm.firstName &&
        !!contactForm.lastName &&
        !!contactForm.email &&
        !!contactForm.phoneNumber &&
        !!contactForm.companyName &&
        !!contactForm.titleOrderNumber &&
        dateValid(contactForm.contractDate) &&
        clientContactAddress.checkAddressValid
      );
    };
    const conditionB = () => {
      return (
        !!manageForm.firstName &&
        !!manageForm.lastName &&
        !!manageForm.email &&
        !!manageForm.phoneNumber &&
        !!manageForm.companyName &&
        !!manageForm.titleOrderNumber &&
        clientManageAddress.checkAddressValid
      );
    };
    if (!POSNotUndefined(isLoanClosing)) {
      return false;
    }
    return isLoanClosing
      ? conditionA() && !!instructions && !!escrowNumber
      : conditionA() && conditionB() && whoIsManaging && !!instructions;
  }, [
    clientContactAddress.checkAddressValid,
    contactForm.companyName,
    contactForm.contractDate,
    contactForm.email,
    contactForm.firstName,
    contactForm.lastName,
    contactForm.phoneNumber,
    contactForm.titleOrderNumber,
    escrowNumber,
    instructions,
    isLoanClosing,
    clientManageAddress.checkAddressValid,
    manageForm.companyName,
    manageForm.email,
    manageForm.firstName,
    manageForm.lastName,
    manageForm.phoneNumber,
    manageForm.titleOrderNumber,
    whoIsManaging,
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
        ) : (
          <StyledFormItem
            gap={6}
            label={'Closing Agent / Title Company Information(Optional)'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={`A closing agent assists with closing and verifies there are no outstanding title issues. ${
              saasState?.organizationName || 'YouLand'
            } also orders a Title Commitment and a Title Report on the property from this agent.`}
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              disabled={saveLoading || skipLoading}
              onClick={handledSkip}
              sx={{ width: '100%', maxWidth: 276 }}
              variant={'outlined'}
            >
              Skip
            </StyledButton>

            <StyledFormItem
              gap={3}
              label={'Provide contact details'}
              labelSx={{ mb: 0 }}
              maxWidth={600}
              sub
            >
              <StyledTextField
                label={'Contact First name'}
                onChange={(e) =>
                  setContactForm({ ...contactForm, firstName: e.target.value })
                }
                value={contactForm.firstName}
              />
              <StyledTextField
                label={'Contact Last name'}
                onChange={(e) =>
                  setContactForm({ ...contactForm, lastName: e.target.value })
                }
                value={contactForm.lastName}
              />
              <StyledTextFieldPhone
                label={'Phone number'}
                onValueChange={({ value }) => {
                  setContactForm({ ...contactForm, phoneNumber: value });
                }}
                value={contactForm.phoneNumber}
              />
              <StyledTextField
                label={'Email'}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                value={contactForm.email}
              />
              <StyledTextField
                label={'Company Name'}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    companyName: e.target.value,
                  })
                }
                value={contactForm.companyName}
              />
              <StyledTextField
                label={'Title Order Number'}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    titleOrderNumber: e.target.value,
                  })
                }
                value={contactForm.titleOrderNumber}
              />
              <StyledDatePicker
                label={'Title Effective Date'}
                onChange={(date) =>
                  setContactForm({ ...contactForm, contractDate: date })
                }
                value={contactForm.contractDate}
              />
              <StyledGoogleAutoComplete address={clientContactAddress} />
            </StyledFormItem>

            <StyledFormItem
              label={
                'Who is signing the closing instructions on behalf of the title company?'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) =>
                    setInstructions(
                      value as string as DashboardTaskInstructions,
                    )
                  }
                  options={OPTIONS_TASK_INSTRUCTIONS}
                  value={instructions}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'Is the title company also managing loan closing?'}
              maxWidth={600}
              sub
            >
              <StyledButtonGroup
                onChange={(e, value) => {
                  if (value !== null) {
                    setIsLoanClosing(value === 'yes');
                  }
                }}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{ width: '100%', maxWidth: 600 }}
                value={isLoanClosing}
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
                    labelSx={{ mb: 0 }}
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

                    <StyledTextField
                      label={'First name'}
                      onChange={(e) =>
                        setManageForm({
                          ...manageForm,
                          firstName: e.target.value,
                        })
                      }
                      value={manageForm.firstName}
                    />
                    <StyledTextField
                      label={'Last name'}
                      onChange={(e) =>
                        setManageForm({
                          ...manageForm,
                          lastName: e.target.value,
                        })
                      }
                      value={manageForm.lastName}
                    />
                    <StyledTextFieldPhone
                      label={'Phone number'}
                      onValueChange={({ value }) => {
                        setManageForm({ ...manageForm, phoneNumber: value });
                      }}
                      value={manageForm.phoneNumber}
                    />
                    <StyledTextField
                      label={'Email'}
                      onChange={(e) =>
                        setManageForm({
                          ...manageForm,
                          email: e.target.value,
                        })
                      }
                      value={manageForm.email}
                    />
                    <StyledTextField
                      label={'Company Name'}
                      onChange={(e) =>
                        setManageForm({
                          ...manageForm,
                          companyName: e.target.value,
                        })
                      }
                      value={manageForm.companyName}
                    />
                    <StyledTextField
                      label={
                        whoIsManaging ===
                        DashboardTaskLoanClosing.escrow_company
                          ? 'Escrow Number'
                          : 'Closing Attorney File No.'
                      }
                      onChange={(e) =>
                        setManageForm({
                          ...manageForm,
                          titleOrderNumber: e.target.value,
                        })
                      }
                      value={manageForm.titleOrderNumber}
                    />
                    <StyledGoogleAutoComplete address={clientManageAddress} />
                  </StyledFormItem>
                ) : (
                  <StyledTextFieldNumber
                    decimalScale={0}
                    label={'Escrow Number'}
                    onValueChange={({ floatValue }) =>
                      setEscrowNumber(floatValue)
                    }
                    thousandSeparator={false}
                    value={escrowNumber}
                  />
                )
              ) : null}
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
                disabled={saveLoading || skipLoading || !isDisabled}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Save
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
