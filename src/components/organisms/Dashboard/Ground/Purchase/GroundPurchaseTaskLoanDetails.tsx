import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { AUTO_HIDE_DURATION } from '@/constants';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledLoading,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const GroundPurchaseTaskLoanDetails: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [purchasePrice, setPurchasePrice] = useState<number | undefined>();
  const [propertyValue, setPropertyValue] = useState<number | undefined>();
  const [cor, setCor] = useState<number | undefined>();
  const [corDate, setCorDate] = useState<unknown | Date | null>(null);
  const [arv, setArv] = useState<number | undefined>();

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
        const { purchasePrice, propertyValue, corDate, cor, arv } = res.data;
        setPurchasePrice(purchasePrice || undefined);
        setPropertyValue(propertyValue || undefined);
        if (corDate) {
          setCorDate(new Date(corDate));
        }
        setCor(cor || undefined);
        setArv(arv || undefined);
      })
      .catch((err) => {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    const dateValid = isValid(corDate) && isDate(corDate);

    return !!purchasePrice && !!propertyValue && dateValid && !!cor && !!arv;
  }, [arv, cor, corDate, propertyValue, purchasePrice]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(corDate) && isDate(corDate);

    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        cor,
        corDate: dateValid
          ? format(corDate as Date, 'yyyy-MM-dd O')
          : undefined,
        purchasePrice,
        propertyValue,
        arv,
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
    arv,
    cor,
    corDate,
    enqueueSnackbar,
    propertyValue,
    purchasePrice,
    router,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'text.grey' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Loan Details'}
      tip={
        'Below are all of the details we have about your deal. If you have to change these details you may do so below, please note that changes may affect your Loan-to-Value or your rate.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'Purchase price'}
        sub
        tip={
          'The price you paid or are paying for the property that the loan is for.'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Purchase Price'}
            onValueChange={({ floatValue }) => {
              setPurchasePrice(floatValue);
            }}
            prefix={'$'}
            value={purchasePrice}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'As-is property value'}
        sub
        tip={
          'Your estimate of the current value of the property (before any rehabilitation).'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'As-is Property Value'}
            onValueChange={({ floatValue }) => {
              setPropertyValue(floatValue);
            }}
            prefix={'$'}
            value={propertyValue}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'Estimated rehab loan amount'}
        sub
        tip={`Total cost that you would like ${
          //sass
          saasState?.organizationName || 'YouLand'
        } to finance.`}
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Estimated Rehab Loan Amount'}
            onValueChange={({ floatValue }) => {
              setCor(floatValue);
            }}
            prefix={'$'}
            value={cor}
          />
        </Stack>
      </StyledFormItem>
      <StyledFormItem label={'Estimated date to finish your rehab project'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledDatePicker
            disableFuture={false}
            disablePast={false}
            label={'MM/DD/YYYY'}
            onChange={(date) => {
              setCorDate(date);
            }}
            //validate={}
            value={corDate}
          />
        </Stack>
      </StyledFormItem>
      <StyledFormItem
        label={'After repair value'}
        sub
        tip={
          'Once all improvements to the property have been made, how much will the property be worth?'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'After repair property value'}
            onValueChange={({ floatValue }) => {
              setArv(floatValue);
            }}
            prefix={'$'}
            value={arv}
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
};
