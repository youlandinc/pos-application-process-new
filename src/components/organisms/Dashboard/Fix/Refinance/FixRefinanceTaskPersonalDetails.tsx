import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSNotUndefined } from '@/utils';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { Address, IAddress } from '@/models/common/Address';
import {
  AUTO_HIDE_DURATION,
  HASH_COMMON_PERSON,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_MARTIAL_STATUS,
} from '@/constants';
import { DashboardTaskMaritalStatus, HttpError, UserType } from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelectOption,
  //StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

export const FixRefinanceTaskPersonalDetails: FC = observer(() => {
  const { userType } = useMst();
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

  const [marital, setMarital] = useState<
    DashboardTaskMaritalStatus | undefined
  >();
  const [delinquentTimes, setDelinquentTimes] = useState<string | undefined>();
  const [isBankruptcy, setIsBankruptcy] = useState<boolean | undefined>();
  const [bankruptDate, setBankruptDate] = useState<unknown | Date | null>(null);
  const [isForeclosure, setIsForeclosure] = useState<boolean | undefined>();
  const [foreclosureDate, setForeclosureDate] = useState<
    unknown | Date | null
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
          propAddr,
          marital,
          bankruptDate,
          delinquentTimes,
          isBankruptcy,
          isForeclosure,
          foreclosureDate,
        } = res.data;

        setMarital((marital as DashboardTaskMaritalStatus) || undefined);
        setIsBankruptcy(isBankruptcy ?? undefined);
        setIsForeclosure(isForeclosure ?? undefined);
        if (bankruptDate) {
          setBankruptDate(new Date(bankruptDate as string));
        }
        if (foreclosureDate) {
          setForeclosureDate(new Date(foreclosureDate as string));
        }

        setDelinquentTimes(delinquentTimes as string);

        setTimeout(() => {
          address.injectServerData({
            formatAddress: '',
            state: '',
            street: '',
            city: '',
            aptNumber: '',
            postcode: '',
            ...propAddr,
          });
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
    const dateValid = isValid(bankruptDate) && isDate(bankruptDate);
    const foreclosureDateValid =
      isValid(foreclosureDate) && isDate(foreclosureDate);
    const isPosBankruptcyUndefined = !POSNotUndefined(isBankruptcy);
    const isPOSForeclosureUndefined = !POSNotUndefined(isForeclosure);

    if (isPosBankruptcyUndefined || isPOSForeclosureUndefined) {
      return false;
    }

    if (isBankruptcy && isForeclosure) {
      return (
        dateValid &&
        foreclosureDateValid &&
        address.checkAddressValid &&
        //!!delinquentTimes &&
        !!marital
      );
    }

    if (isBankruptcy) {
      return (
        dateValid && address.checkAddressValid && !!marital
        //&& !!delinquentTimes
      );
    }

    if (isForeclosure) {
      return (
        address.checkAddressValid &&
        !!marital &&
        //!!delinquentTimes &&
        foreclosureDateValid
      );
    }

    return address.checkAddressValid && !!marital;
    //&& !!delinquentTimes;
  }, [
    address.checkAddressValid,
    //delinquentTimes,
    bankruptDate,
    foreclosureDate,
    isBankruptcy,
    isForeclosure,
    marital,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(bankruptDate) && isDate(bankruptDate);
    const foreclosureDateValid =
      isValid(foreclosureDate) && isDate(foreclosureDate);
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        marital,
        delinquentTimes,
        propAddr: address.getPostData(),
        isBankruptcy,
        isForeclosure,
        bankruptDate: dateValid
          ? format(bankruptDate as Date, 'yyyy-MM-dd O')
          : undefined,
        foreclosureDate: foreclosureDateValid
          ? format(foreclosureDate as Date, 'yyyy-MM-dd O')
          : undefined,
      },
    };
    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
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
  }, [
    address,
    delinquentTimes,
    bankruptDate,
    enqueueSnackbar,
    foreclosureDate,
    isBankruptcy,
    isForeclosure,
    marital,
    router,
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
            label={'Personal details'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={`Please enter and confirm all of ${
              HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
            } personally identifiable information so we may begin processing  ${
              HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
            }  application.`}
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={`What is ${
                HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
              } marital status?`}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) =>
                    setMarital(value as string as DashboardTaskMaritalStatus)
                  }
                  options={OPTIONS_TASK_MARTIAL_STATUS}
                  value={marital}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Current address'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledGoogleAutoComplete address={address} disabled />
              </Stack>
            </StyledFormItem>

            {/*<StyledFormItem*/}
            {/*  label={*/}
            {/*    'In the past 3 years, how many times have you had a credit account with 60 or more days delinquent?'*/}
            {/*  }*/}
            {/*  sub*/}
            {/*>*/}
            {/*  <Stack maxWidth={600} width={'100%'}>*/}
            {/*    <StyledTextFieldNumber*/}
            {/*      decimalScale={0}*/}
            {/*      label={'Delinquent times'}*/}
            {/*      onValueChange={({ formattedValue }) => {*/}
            {/*        setDelinquentTimes(formattedValue);*/}
            {/*      }}*/}
            {/*      thousandSeparator={false}*/}
            {/*      value={delinquentTimes}*/}
            {/*    />*/}
            {/*  </Stack>*/}
            {/*</StyledFormItem>*/}

            <StyledFormItem
              label={`Have ${
                HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER]
                  .the_third_subject
              } declared bankruptcy within the past 7 years?`}
              sub
            >
              <StyledButtonGroup
                onChange={(e, value) => {
                  if (value !== null) {
                    setIsBankruptcy(value === 'yes');
                  }
                }}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{ width: '100%', maxWidth: 600 }}
                value={isBankruptcy}
              />
              <Transitions
                style={{
                  display: isBankruptcy ? 'block' : 'none',
                  width: '100%',
                  maxWidth: 600,
                }}
              >
                {isBankruptcy && (
                  <Stack mt={3}>
                    <StyledDatePicker
                      label={'Bankruptcy filing date'}
                      onChange={(date) => {
                        setBankruptDate(date);
                      }}
                      value={bankruptDate}
                    />
                  </Stack>
                )}
              </Transitions>
            </StyledFormItem>

            <StyledFormItem
              label={`Have ${
                HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER]
                  .the_third_subject
              } had property foreclosure upon in the past 7 years?`}
              sub
            >
              <StyledButtonGroup
                onChange={(e, value) => {
                  if (value !== null) {
                    setIsForeclosure(value === 'yes');
                  }
                }}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{ width: '100%', maxWidth: 600 }}
                value={isForeclosure}
              />
              <Transitions
                style={{
                  display: isForeclosure ? 'block' : 'none',
                  width: '100%',
                  maxWidth: 600,
                }}
              >
                {isForeclosure && (
                  <Stack mt={3}>
                    <StyledDatePicker
                      label={'Property foreclosure filing date'}
                      onChange={(date) => {
                        setForeclosureDate(date);
                      }}
                      value={foreclosureDate}
                    />
                  </Stack>
                )}
              </Transitions>
            </StyledFormItem>

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
                disabled={!isDisabled || saveLoading}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
