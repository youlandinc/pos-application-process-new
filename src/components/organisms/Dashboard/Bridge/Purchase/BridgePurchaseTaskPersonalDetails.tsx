import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { Address, IAddress } from '@/models/common/Address';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_TASK_CITIZENSHIP_STATUS,
  OPTIONS_TASK_MARTIAL_STATUS,
} from '@/constants';
import {
  DashboardTaskCitizenshipStatus,
  DashboardTaskMaritalStatus,
} from '@/types';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelectOption,
  StyledTextFieldNumber,
} from '@/components/atoms';

export const BridgePurchaseTaskPersonalDetails: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

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
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [citizenship, setCitizenship] = useState<
    DashboardTaskCitizenshipStatus | undefined
  >();
  const [marital, setMarital] = useState<
    DashboardTaskMaritalStatus | undefined
  >();
  const [delinquentTimes, setDelinquentTimes] = useState<string | undefined>();
  const [dischargeDate, setDischargeDate] = useState<unknown | Date | null>();

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          propAddr,
          marital,
          dischargeDate,
          delinquentTimes,
          citizenship,
        } = res.data;
        setCitizenship(citizenship as DashboardTaskCitizenshipStatus);
        setMarital(marital as DashboardTaskMaritalStatus);
        setDelinquentTimes(delinquentTimes as string);
        if (dischargeDate) {
          setDischargeDate(new Date(dischargeDate));
        }
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
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    const dateValid = isValid(dischargeDate) && isDate(dischargeDate);

    return (
      address.checkAddressValid &&
      !!marital &&
      !!citizenship &&
      !!delinquentTimes &&
      dateValid
    );
  }, [
    address.checkAddressValid,
    citizenship,
    delinquentTimes,
    dischargeDate,
    marital,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(dischargeDate) && isDate(dischargeDate);
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        propAddr: address.getPostData(),
        dischargeDate: dateValid
          ? format(dischargeDate as Date, 'yyyy-MM-dd O')
          : undefined,
        marital,
        delinquentTimes,
        citizenship,
      },
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
    address,
    citizenship,
    delinquentTimes,
    dischargeDate,
    enqueueSnackbar,
    marital,
    router,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Personal Details'}
      tip={
        'Please enter and confirm all of your personally identifiable information so we may begin processing your application.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'What is your citizenship status?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) =>
              setCitizenship(value as string as DashboardTaskCitizenshipStatus)
            }
            options={OPTIONS_TASK_CITIZENSHIP_STATUS}
            value={citizenship}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'What is your marital status?'} sub>
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

      <StyledFormItem label={'Current Address'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledGoogleAutoComplete address={address} />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={
          'In the past 3 years, how many times have you had a credit account with 60 or more days delinquent?'
        }
        sub
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Delinquent Times'}
            onValueChange={({ formattedValue }) => {
              setDelinquentTimes(formattedValue);
            }}
            thousandSeparator={false}
            value={delinquentTimes}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={
          'Please provide the discharge date of your most recent bankruptcy event, If applicable.'
        }
        sub
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledDatePicker
            label={'MM/DD/YYYY'}
            onChange={(date) => {
              setDischargeDate(date);
            }}
            //validate={}
            value={dischargeDate}
          />
        </Stack>
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
          Save
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
